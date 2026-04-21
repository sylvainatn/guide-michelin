import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.url(),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.coerce.number().default(60 * 15),
  JWT_REFRESH_TTL: z.coerce.number().default(60 * 60 * 24 * 30),
  // Appliqué uniquement en production (cf. api/lib/cookies.ts).
  COOKIE_DOMAIN: z.string().optional(),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
