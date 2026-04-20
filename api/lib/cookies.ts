import type { CookieOptions, Response } from "express";
import { env } from "../config/env";

export const REFRESH_COOKIE = "refresh_token";

const baseOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  domain: env.COOKIE_DOMAIN,
  path: "/auth",
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
