import { prisma } from "../../../lib/prisma";
import type { UpdateProfileInput } from "./profile.schema";

export const getProfile = async (userId: string) =>
  prisma.userProfile.findUnique({ where: { userId } });

export const upsertProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
  const { completed, ...rest } = input;
  const onboardingCompletedAt = completed ? new Date() : undefined;
  const data = { ...rest, ...(onboardingCompletedAt && { onboardingCompletedAt }) };

  return prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
};
