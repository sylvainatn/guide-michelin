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

# ---------- builder (build Next standalone + prune des devDependencies) ----------
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
    HOSTNAME=0.0.0.0 \
    API_PORT=4000

RUN apk add --no-cache openssl tini wget \
    && addgroup -S michelin \
    && adduser -S -u 1001 -G michelin michelin

# --- Next standalone : server.js + sous-arbre node_modules minimal ---
COPY --from=builder --chown=michelin:michelin /app/.next/standalone ./
COPY --from=builder --chown=michelin:michelin /app/.next/static     ./.next/static
COPY --from=builder --chown=michelin:michelin /app/public           ./public

# --- API Express + dépendances runtime (tsx, prisma, express, etc.) ---
# Prisma + tsx + express ne sont pas embarqués par standalone → on copie
# le node_modules pruné qui contient déjà juste les prod deps.
COPY --from=builder --chown=michelin:michelin /app/node_modules      ./node_modules
COPY --from=builder --chown=michelin:michelin /app/api               ./api
COPY --from=builder --chown=michelin:michelin /app/lib               ./lib
COPY --from=builder --chown=michelin:michelin /app/prisma            ./prisma
COPY --from=builder --chown=michelin:michelin /app/app/generated     ./app/generated
COPY --from=builder --chown=michelin:michelin /app/package.json      ./package.json
COPY --from=builder --chown=michelin:michelin /app/prisma.config.ts  ./prisma.config.ts
COPY --from=builder --chown=michelin:michelin /app/tsconfig.json     ./tsconfig.json

COPY --chown=michelin:michelin docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && mkdir -p /app/public/uploads/videos /app/public/uploads/images \
    && chown -R michelin:michelin /app/public/uploads

USER michelin

EXPOSE 3000 4000

# Healthcheck = Next (3000) ET API (4000) doivent répondre.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget -q --spider http://localhost:3000/ \
        && wget -q --spider http://localhost:4000/health \
        || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/entrypoint.sh"]
