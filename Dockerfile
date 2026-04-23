# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:22.12-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ---------- deps (install complet pour le build) ----------
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund

# ---------- builder (build Next + prune des devDependencies) ----------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate \
    && npm run build \
    && npm prune --omit=dev --ignore-scripts

# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache openssl postgresql-client tini wget \
    && addgroup -S michelin \
    && adduser -S -u 1001 -G michelin michelin

COPY --from=builder --chown=michelin:michelin /app/node_modules       ./node_modules
COPY --from=builder --chown=michelin:michelin /app/.next              ./.next
COPY --from=builder --chown=michelin:michelin /app/public             ./public
COPY --from=builder --chown=michelin:michelin /app/app                ./app
COPY --from=builder --chown=michelin:michelin /app/api                ./api
COPY --from=builder --chown=michelin:michelin /app/lib                ./lib
COPY --from=builder --chown=michelin:michelin /app/components         ./components
COPY --from=builder --chown=michelin:michelin /app/prisma             ./prisma
COPY --from=builder --chown=michelin:michelin /app/next.config.ts     ./next.config.ts
COPY --from=builder --chown=michelin:michelin /app/next-env.d.ts      ./next-env.d.ts
COPY --from=builder --chown=michelin:michelin /app/tsconfig.json      ./tsconfig.json
COPY --from=builder --chown=michelin:michelin /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder --chown=michelin:michelin /app/prisma.config.ts   ./prisma.config.ts
COPY --from=builder --chown=michelin:michelin /app/package.json       ./package.json
COPY --from=builder --chown=michelin:michelin /app/package-lock.json  ./package-lock.json
# Dump SQL optionnel — appliqué par l'entrypoint s'il est présent.
COPY --from=builder --chown=michelin:michelin /app/mydb.sql           ./mydb.sql

COPY --chown=michelin:michelin docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && mkdir -p /app/public/uploads/videos \
    && chown -R michelin:michelin /app/public/uploads

USER michelin

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -q --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/entrypoint.sh"]
