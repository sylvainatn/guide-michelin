import type { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../lib/errors";
import { verifyAccessToken } from "../services/token.service";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) throw Unauthorized("missing_access_token");

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    throw Unauthorized("invalid_access_token");
  }
};
