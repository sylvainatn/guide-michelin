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
  grep -v '^\\connect' /app/mydb.sql | psql "$DATABASE_URL" || \
    echo "[entrypoint] mydb.sql returned non-zero (duplicates?) — continuing."
fi

mkdir -p /app/public/uploads/videos /app/public/uploads/images

echo "[entrypoint] Starting Next (3000) + API (4000)..."
exec npx concurrently -n next,api -c blue,green \
  --restart-tries 10 \
  --restart-after 2000 \
  "npx next start -H 0.0.0.0 -p 3000" \
  "npx tsx api/server.ts"
