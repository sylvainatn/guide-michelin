import { prisma } from "../../../lib/prisma";
import { env } from "../../config/env";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "./token.service";

export type CreateSessionInput = {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
};

export const createSession = async (input: CreateSessionInput) => {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL * 1000);

  const session = await prisma.session.create({
    data: {
      userId: input.userId,
      refreshTokenHash,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt,
    },
  });

  return { session, refreshToken };
};

export const findValidSession = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash },
    include: { user: true },
  });

  if (!session) return null;
  if (session.revokedAt) return null;
  if (session.expiresAt < new Date()) return null;

  return session;
};

export const rotateSession = async (sessionId: string) => {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL * 1000);

  await prisma.session.update({
    where: { id: sessionId },
    data: { refreshTokenHash, expiresAt },
  });

  return refreshToken;
};

export const revokeSession = (sessionId: string) =>
  prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });

export const revokeUserSessions = (userId: string) =>
  prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
