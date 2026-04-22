#!/bin/sh
set -e

echo "[entrypoint] Applying Prisma migrations..."
npx prisma migrate deploy

mkdir -p /app/public/uploads/videos

echo "[entrypoint] Starting Next (3000) + API (4000)..."
exec npx concurrently -n next,api -c blue,green \
  --restart-tries 10 \
  --restart-after 2000 \
  "npx next start -H 0.0.0.0 -p 3000" \
  "npx tsx api/server.ts"
