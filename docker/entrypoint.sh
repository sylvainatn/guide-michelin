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

mkdir -p /app/public/uploads/videos

echo "[entrypoint] Starting Next (3000) + API (4000)..."
exec npx concurrently -n next,api -c blue,green \
  --restart-tries 10 \
  --restart-after 2000 \
  "npx next start -H 0.0.0.0 -p 3000" \
  "npx tsx api/server.ts"
