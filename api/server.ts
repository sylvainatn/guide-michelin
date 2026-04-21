import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { redis } from "../lib/redis";

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  const pong = await redis.ping();
  res.json({ status: "ok", redis: pong });
});

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(env.API_PORT, () => {
  console.log(`API listening on http://localhost:${env.API_PORT}`);
});
