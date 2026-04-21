import type { NextFunction, Request, Response } from "express";
import { Forbidden } from "../lib/errors";

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    throw Forbidden("forbidden", "Admin role required");
  }
  next();
};
