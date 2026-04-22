import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Forbidden, NotFound } from "../../lib/errors";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "./restaurant.schema";

const requireRestaurantId = (req: Request): string => {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  return id;
};

const findOwnedRestaurantOrThrow = async (id: string, userId: string) => {
  const existing = await prisma.restaurant.findUnique({
    where: { id },
    select: { id: true, ownerId: true },
  });
  if (!existing) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  if (existing.ownerId !== userId) {
    throw Forbidden("forbidden", "Tu n'es pas proprietaire de ce restaurant.");
  }
  return existing;
};

export const create = async (req: Request, res: Response) => {
  const input = createRestaurantSchema.parse(req.body);
  const ownerId = req.user!.id;

  const restaurant = await prisma.restaurant.create({
    data: {
      name: input.name,
      description: input.description,
      address: input.address,
      videoUrl: input.videoUrl,
      chefName: input.chefName,
      stars: input.stars,
      priceRange: input.priceRange,
      style: input.style ?? [],
      ownerId,
    },
  });

  res.status(201).json({ restaurant });
};

export const getById = async (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      videoUrl: true,
      chefName: true,
      stars: true,
      priceRange: true,
      style: true,
      tourStops: true,
      photos360: true,
      createdAt: true,
    },
  });
  if (!restaurant) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  res.json({ restaurant });
};

export const listMine = async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ restaurants });
};

export const update = async (req: Request, res: Response) => {
  const id = requireRestaurantId(req);
  const userId = req.user!.id;
  await findOwnedRestaurantOrThrow(id, userId);

  const input = updateRestaurantSchema.parse(req.body);

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.address !== undefined ? { address: input.address } : {}),
      ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl } : {}),
      ...(input.chefName !== undefined ? { chefName: input.chefName } : {}),
      ...(input.stars !== undefined ? { stars: input.stars } : {}),
      ...(input.priceRange !== undefined
        ? { priceRange: input.priceRange }
        : {}),
      ...(input.style !== undefined ? { style: input.style } : {}),
    },
  });

  res.json({ restaurant });
};

export const remove = async (req: Request, res: Response) => {
  const id = requireRestaurantId(req);
  const userId = req.user!.id;
  await findOwnedRestaurantOrThrow(id, userId);

  // Les articles ont une FK sur restaurant : on les supprime en amont pour
  // eviter une erreur de contrainte d'integrite.
  await prisma.$transaction([
    prisma.article.deleteMany({ where: { restaurantId: id } }),
    prisma.restaurant.delete({ where: { id } }),
  ]);

  res.status(204).end();
};

export const listFeed = async (_req: Request, res: Response) => {
  const restaurants = await prisma.restaurant.findMany({
    where: { videoUrl: { not: null } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      videoUrl: true,
      chefName: true,
      stars: true,
      style: true,
      createdAt: true,
    },
  });
  res.json({ restaurants });
};
