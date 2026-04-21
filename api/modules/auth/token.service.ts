import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
};

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL,
  });

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof decoded === "string") {
    throw new Error("invalid token payload");
  }
  const role = decoded.role;
  if (role !== "USER" && role !== "ADMIN") {
    throw new Error("invalid role in token payload");
  }
  return {
    sub: decoded.sub as string,
    email: decoded.email as string,
    role,
  };
};

export const generateRefreshToken = () =>
  crypto.randomBytes(48).toString("base64url");

export const hashRefreshToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
