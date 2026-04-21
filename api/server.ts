import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { openApiDocument } from "./lib/openapi";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { restaurantRouter } from "./modules/restaurants/restaurant.routes";
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

// Swagger UI — documentation interactive de l'API.
// - UI : GET /docs
// - Spec brute JSON : GET /docs.json
app.get("/docs.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/auth", authRouter);
app.use("/restaurants", restaurantRouter);

app.use(errorHandler);

app.listen(env.API_PORT, () => {
  console.log(`API listening on http://localhost:${env.API_PORT}`);
  console.log(`API docs available at http://localhost:${env.API_PORT}/docs`);
});
