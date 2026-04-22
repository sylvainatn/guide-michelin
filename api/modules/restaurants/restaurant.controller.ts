import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { NotFound } from "../../lib/errors";
import { createRestaurantSchema } from "./restaurant.schema";

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
      createdAt: true,
    },
  });
  res.json({ restaurants });
};
