# Guide Michelin — Hackathon Skolae 2026

Application Next.js 16 (App Router) + API Express + Prisma 7 + Postgres 15 + Redis 7.

## Prérequis

- Node.js 22+
- Docker + Docker Compose

## Installation

```bash
git clone git@github.com:sylvainatn/guide-michelin.git
cd guide-michelin
cp .env.example .env
npm install
```

## Lancement (dev)

```bash
npm run dev
```

Ce script enchaîne :

1. `docker compose up -d` (Postgres, Redis, Adminer)
2. `npx prisma generate`
3. `npx prisma migrate dev`
4. `npm run seed`
5. Next sur `http://localhost:3000` + API Express sur `http://localhost:4000`

Adminer (UI Postgres) : `http://localhost:8080` — serveur `postgres`, login/mdp depuis `.env`.

## Comptes de démo

Créés automatiquement par le seed.

| Rôle  | Email                  | Mot de passe  |
|-------|------------------------|---------------|
| ADMIN | `admin@michelin.local` | `Admin1234!`  |
| USER  | `user@michelin.local`  | `User1234!`   |

- L'admin a accès au back-office `/dashboard` (création/édition restaurants & hébergements).
- L'user accède au feed public, aux réservations, à son profil et à `/account`.
