import type { Request, Response } from "express";
import { REFRESH_COOKIE, clearRefreshCookie, setRefreshCookie } from "../lib/cookies";
import { Unauthorized } from "../lib/errors";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";

const reqCtx = (req: Request) => ({
  userAgent: req.get("user-agent") ?? undefined,
  ipAddress: req.ip,
});

export const signup = async (req: Request, res: Response) => {
  const input = signupSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.signup(input, reqCtx(req));
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
};

export const login = async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.login(input, reqCtx(req));
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw Unauthorized("missing_refresh_token");
  const { user, accessToken, refreshToken } = await authService.refresh(token);
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  await authService.logout(token);
  clearRefreshCookie(res);
  res.status(204).end();
};

export const me = async (req: Request, res: Response) => {
  const user = await authService.me(req.user!.id);
  res.json({ user });
};
