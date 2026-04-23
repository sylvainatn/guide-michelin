import { prisma } from "../../../lib/prisma";
import { Forbidden, NotFound } from "../../lib/errors";
import type {
  CreateAccommodationInput,
  UpdateAccommodationInput,
} from "./accommodation.schema";

const findOwnedOrThrow = async (id: string, userId: string) => {
  const existing = await prisma.accommodation.findUnique({
    where: { id },
    select: { id: true, ownerId: true },
  });
  if (!existing) {
    throw NotFound("accommodation_not_found", "Hébergement introuvable.");
  }
  if (existing.ownerId !== userId) {
    throw Forbidden(
      "forbidden",
      "Tu n'es pas propriétaire de cet hébergement.",
    );
  }
  return existing;
};

export const listOwn = (ownerId: string) =>
  prisma.accommodation.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });

export const getById = async (id: string) => {
  const accommodation = await prisma.accommodation.findUnique({
    where: { id },
  });
  if (!accommodation) {
    throw NotFound("accommodation_not_found", "Hébergement introuvable.");
  }
  return accommodation;
};

export const create = (ownerId: string, input: CreateAccommodationInput) =>
  prisma.accommodation.create({
    data: {
      ownerId,
      name: input.name,
      description: input.description,
      address: input.address,
      category: input.category,
      stars: input.stars,
      priceFromEur: input.priceFromEur,
      mainImageUrl: input.mainImageUrl,
      videoUrl: input.videoUrl,
      video360: input.video360 ?? false,
      amenities: input.amenities ?? [],
      photos: input.photos ?? [],
    },
  });

export const update = async (
  id: string,
  userId: string,
  input: UpdateAccommodationInput,
) => {
  await findOwnedOrThrow(id, userId);
  return prisma.accommodation.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.address !== undefined ? { address: input.address } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.stars !== undefined ? { stars: input.stars } : {}),
      ...(input.priceFromEur !== undefined
        ? { priceFromEur: input.priceFromEur }
        : {}),
      ...(input.mainImageUrl !== undefined
        ? { mainImageUrl: input.mainImageUrl }
        : {}),
      ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl } : {}),
      ...(input.video360 !== undefined ? { video360: input.video360 } : {}),
      ...(input.amenities !== undefined ? { amenities: input.amenities } : {}),
      ...(input.photos !== undefined ? { photos: input.photos } : {}),
    },
  });
};

export const remove = async (id: string, userId: string) => {
  await findOwnedOrThrow(id, userId);
  await prisma.accommodation.delete({ where: { id } });
};
