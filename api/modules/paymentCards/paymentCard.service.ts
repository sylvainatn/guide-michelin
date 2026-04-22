import { prisma } from "../../../lib/prisma";
import { NotFound } from "../../lib/errors";
import type { CreatePaymentCardInput } from "./paymentCard.schema";

export const listPaymentCards = (userId: string) =>
  prisma.paymentCard.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

export const createPaymentCard = (
  userId: string,
  input: CreatePaymentCardInput,
) =>
  prisma.paymentCard.create({
    data: { userId, ...input },
  });

export const removePaymentCard = async (userId: string, id: string) => {
  const card = await prisma.paymentCard.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!card || card.userId !== userId) {
    throw NotFound("payment_card_not_found", "Carte introuvable.");
  }
  await prisma.paymentCard.delete({ where: { id } });
};
