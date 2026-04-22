import type { CookieOptions, Response } from "express";
import { env } from "../config/env";

export const REFRESH_COOKIE = "refresh_token";

const baseOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.COOKIE_SECURE,
  // Omis en dev : Chrome rejette `domain=localhost` et laisser undefined
  // scope correctement le cookie à l'hôte.
  domain: env.NODE_ENV === "production" ? env.COOKIE_DOMAIN : undefined,
  // `/` so the cookie is sent to Next.js `/api/auth/*` rewrites, not only `/auth/*` on the API host.
  path: "/",
};

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE, token, {
    ...baseOptions,
    maxAge: env.JWT_REFRESH_TTL * 1000,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE, baseOptions);
};
