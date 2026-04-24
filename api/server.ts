import "dotenv/config";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { friendRouter } from "./modules/friends/friend.routes";
import { interactionRouter } from "./modules/interactions/interaction.routes";
import { accommodationRouter } from "./modules/accommodations/accommodation.routes";
import { feedRouter } from "./modules/feed/feed.routes";
import { paymentCardRouter } from "./modules/paymentCards/paymentCard.routes";
import { profileRouter } from "./modules/profile/profile.routes";
import { reservationRouter } from "./modules/reservations/reservation.routes";
import { restaurantRouter } from "./modules/restaurants/restaurant.routes";
import { userRouter } from "./modules/user/user.routes";
import { redis } from "../lib/redis";

const app = express();

// Derrière Caddy/Traefik en prod : 1 seul hop proxy.
app.set("trust proxy", 1);

// Headers de sécurité. `crossOriginResourcePolicy: "cross-origin"` car les
// `/uploads` sont consommés par Next via rewrites (origine différente en dev).
// CSP désactivée ici : gérée côté Next/Caddy pour inclure le front.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Next en prod scanne `public/` au démarrage : les fichiers uploadés ensuite
// ne sont pas servis. On les sert depuis Express qui lit le disque à chaque requête.
// `X-Content-Type-Options: nosniff` est déjà posé par Helmet — protège contre
// l'exécution d'un SVG piégé comme HTML.
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "public", "uploads"), {
    fallthrough: false,
    index: false,
  }),
);

app.get("/health", async (_req, res) => {
  const pong = await redis.ping();
  res.json({ status: "ok", redis: pong });
});

app.use("/auth", authRouter);
app.use("/me/profile", profileRouter);
app.use("/me/payment-cards", paymentCardRouter);
app.use("/me/reservations", reservationRouter);
app.use("/me/friends", friendRouter);
app.use("/me", userRouter);
app.use("/me", interactionRouter);
app.use("/restaurants", restaurantRouter);
app.use("/accommodations", accommodationRouter);
app.use("/feed", feedRouter);

app.use(errorHandler);

app.listen(env.API_PORT, () => {
  console.log(`API listening on http://localhost:${env.API_PORT}`);
});
