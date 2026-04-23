import { prisma } from "../../../lib/prisma";
import { BadRequest, NotFound } from "../../lib/errors";
import type { CreateReservationInput } from "./reservation.schema";

export const createReservation = async (
  userId: string,
  input: CreateReservationInput,
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: input.restaurantId },
    select: { id: true },
  });
  if (!restaurant) {
    throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  }

  if (input.checkOut.getTime() <= input.checkIn.getTime()) {
    throw BadRequest(
      "invalid_dates",
      "La date de départ doit être postérieure à la date d'arrivée.",
    );
  }

  return prisma.reservation.create({
    data: {
      userId,
      restaurantId: input.restaurantId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      nights: input.nights,
      adults: input.adults,
      children: input.children ?? 0,
      roomId: input.roomId,
      roomName: input.roomName,
      roomCategory: input.roomCategory,
      eventType: input.eventType ?? null,
      customRequest: input.customRequest,
      invitedFriends: input.invitedFriends ?? undefined,
      michelinExtras: input.michelinExtras ?? undefined,
      paymentMethod: input.paymentMethod,
      cardLast4: input.cardLast4,
      totalAmount: input.totalAmount,
      pricePerPerson: input.pricePerPerson,
    },
  });
};

export const listReservations = (userId: string) =>
  prisma.reservation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          address: true,
          mainImageUrl: true,
          stars: true,
          chefName: true,
        },
      },
    },
  });

export const getReservation = async (userId: string, id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          address: true,
          mainImageUrl: true,
          stars: true,
          chefName: true,
        },
      },
    },
  });
  if (!reservation || reservation.userId !== userId) {
    throw NotFound("reservation_not_found", "Réservation introuvable.");
  }
  return reservation;
};

export const cancelReservation = async (userId: string, id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!reservation || reservation.userId !== userId) {
    throw NotFound("reservation_not_found", "Réservation introuvable.");
  }
  return prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};
