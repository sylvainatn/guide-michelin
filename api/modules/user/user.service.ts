import { prisma } from "../../../lib/prisma";
import { Conflict, Unauthorized } from "../../lib/errors";
import { publicUser } from "../auth/auth.service";
import { hashPassword, verifyPassword } from "../auth/password.service";
import type { ChangePasswordInput, UpdateUserInput } from "./user.schema";

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  if (input.pseudo) {
    const existing = await prisma.user.findUnique({
      where: { pseudo: input.pseudo },
      select: { id: true },
    });
    if (existing && existing.id !== userId) {
      throw Conflict("pseudo_taken", "Pseudo already taken");
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
  });

  return publicUser(user);
};

export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) throw Unauthorized("invalid_credentials");

  const ok = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!ok) throw Unauthorized("invalid_password", "Mot de passe actuel incorrect.");

  const passwordHash = await hashPassword(input.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};
