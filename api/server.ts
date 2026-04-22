import "dotenv/config";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { profileRouter } from "./modules/profile/profile.routes";
import { restaurantRouter } from "./modules/restaurants/restaurant.routes";
import { redis } from "../lib/redis";

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Next en prod scanne `public/` au démarrage : les fichiers uploadés ensuite
// ne sont pas servis. On les sert depuis Express qui lit le disque à chaque requête.
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
app.use("/restaurants", restaurantRouter);

app.use(errorHandler);

app.listen(env.API_PORT, () => {
  console.log(`API listening on http://localhost:${env.API_PORT}`);
});
