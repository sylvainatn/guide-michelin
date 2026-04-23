#!/bin/sh
set -e

echo "[entrypoint] Applying Prisma migrations..."
npx prisma migrate deploy

if [ "${SKIP_SEED:-0}" = "1" ]; then
  echo "[entrypoint] SKIP_SEED=1, skipping seeders."
else
  echo "[entrypoint] Running seeders..."
  npx tsx prisma/seed.ts
fi

# Import optionnel d'un dump SQL (données manuelles exportées via Adminer).
# Les `\connect` d'Adminer sont ignorés car DATABASE_URL pointe déjà vers la
# bonne DB. Les ré-imports déclencheront des duplicate key errors qu'on ignore
# pour ne pas crash le container.
if [ -f /app/mydb.sql ]; then
  echo "[entrypoint] Applying mydb.sql..."
  # On récupère l'id réel de l'admin (créé par le seeder) et on substitue le
  # placeholder `b10ed346-…` du dump par ce vrai id. Comme ça, pas besoin
  # d'épingler l'id côté Prisma ni de supprimer un admin existant.
  set +e
  ADMIN_REAL_ID=$(psql "$DATABASE_URL" -t -A \
    -c "SELECT id FROM users WHERE email='admin@michelin.local' LIMIT 1;")
  if [ -z "$ADMIN_REAL_ID" ]; then
    echo "[entrypoint] admin introuvable — mydb.sql ignoré."
  else
    echo "[entrypoint] admin id = $ADMIN_REAL_ID"
    # `\connect` stripé : DATABASE_URL pointe déjà sur la bonne DB.
    grep -v '^\\connect' /app/mydb.sql \
      | sed "s/b10ed346-5125-46da-b20f-b83551ae30b0/$ADMIN_REAL_ID/g" \
      | psql "$DATABASE_URL"
    PSQL_EXIT=$?
    if [ "$PSQL_EXIT" != "0" ]; then
      echo "[entrypoint] mydb.sql exited $PSQL_EXIT — continuing boot."
    fi
  fi
  set -e
fi

mkdir -p /app/public/uploads/videos /app/public/uploads/images

echo "[entrypoint] Starting Next (3000) + API (4000)..."
exec npx concurrently -n next,api -c blue,green \
  --restart-tries 10 \
  --restart-after 2000 \
  "npx next start -H 0.0.0.0 -p 3000" \
  "npx tsx api/server.ts"
