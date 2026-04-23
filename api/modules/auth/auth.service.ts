import { prisma } from "../../../lib/prisma";
import { BadRequest, Conflict, Unauthorized } from "../../lib/errors";
import { hashPassword, verifyPassword } from "./password.service";
import {
  createSession,
  findValidSession,
  revokeSession,
  rotateSession,
} from "./session.service";
import { signAccessToken } from "./token.service";

type Ctx = { userAgent?: string; ipAddress?: string };

export const signup = async (
  input: {
    email: string;
    pseudo: string;
    password: string;
    lastName: string;
    firstName: string;
  },
  ctx: Ctx,
) => {
  const [emailTaken, pseudoTaken] = await Promise.all([
    prisma.user.findUnique({ where: { email: input.email } }),
    prisma.user.findUnique({ where: { pseudo: input.pseudo } }),
  ]);
  if (emailTaken) throw Conflict("email_taken", "Email already registered");
  if (pseudoTaken) throw Conflict("pseudo_taken", "Pseudo already taken");

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      pseudo: input.pseudo,
      passwordHash,
      lastName: input.lastName,
      firstName: input.firstName,
    },
  });

  const { refreshToken } = await createSession({
    userId: user.id,
    userAgent: ctx.userAgent,
    ipAddress: ctx.ipAddress,
  });
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: publicUser(user), accessToken, refreshToken };
};

export const login = async (
  input: { email: string; password: string },
  ctx: Ctx,
) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (!user) throw Unauthorized("invalid_credentials", "Invalid credentials");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw Unauthorized("invalid_credentials", "Invalid credentials");

  const { refreshToken } = await createSession({
    userId: user.id,
    userAgent: ctx.userAgent,
    ipAddress: ctx.ipAddress,
  });
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { user: publicUser(user), accessToken, refreshToken };
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) throw Unauthorized("missing_refresh_token");
  const session = await findValidSession(refreshToken);
  if (!session) throw Unauthorized("invalid_refresh_token");

  const newRefreshToken = await rotateSession(session.id);
  const accessToken = signAccessToken({
    sub: session.user.id,
    email: session.user.email,
    role: session.user.role,
  });

  return {
    user: publicUser(session.user),
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken: string | undefined) => {
  if (!refreshToken) return;
  const session = await findValidSession(refreshToken);
  if (session) await revokeSession(session.id);
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw BadRequest("user_not_found", "User not found");
  return publicUser(user);
};

export const isPseudoAvailable = async (pseudo: string) => {
  const existing = await prisma.user.findUnique({ where: { pseudo } });
  return !existing;
};

export const publicUser = (user: {
  id: string;
  email: string;
  pseudo: string;
  lastName: string;
  firstName: string;
  emailVerified: Date | null;
  createdAt: Date;
  role: "USER" | "ADMIN";
}) => ({
  id: user.id,
  email: user.email,
  pseudo: user.pseudo,
  lastName: user.lastName,
  firstName: user.firstName,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  role: user.role,
});
