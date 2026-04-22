import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../lib/errors";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: {
        code: "validation_error",
        message: "Invalid request payload",
        details: z.treeifyError(err),
      },
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  console.error(`[error] ${req.method} ${req.originalUrl}`, err);

  res.status(500).json({
    error: { code: "internal_error", message: "Internal server error" },
  });
};
