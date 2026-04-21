import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { Forbidden, NotFound } from "../../lib/errors";
import {
  createRestaurantSchema,
  restaurantIdParamSchema,
  updateRestaurantSchema,
} from "./restaurant.schema";

export const create = async (req: Request, res: Response) => {
  const input = createRestaurantSchema.parse(req.body);
  const ownerId = req.user!.id;

  const restaurant = await prisma.restaurant.create({
    data: {
      name: input.name,
      description: input.description,
      address: input.address,
      videoUrl: input.videoUrl,
      ownerId,
    },
  });

  res.status(201).json({ restaurant });
};

export const listMine = async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ restaurants });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = restaurantIdParamSchema.parse(req.params);
  const ownerId = req.user!.id;

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  if (restaurant.ownerId !== ownerId) {
    throw Forbidden("not_owner", "Ce restaurant ne t'appartient pas.");
  }

  res.json({ restaurant });
};

export const update = async (req: Request, res: Response) => {
  const { id } = restaurantIdParamSchema.parse(req.params);
  const input = updateRestaurantSchema.parse(req.body);
  const ownerId = req.user!.id;

  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  if (existing.ownerId !== ownerId) {
    throw Forbidden("not_owner", "Ce restaurant ne t'appartient pas.");
  }

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      address: input.address,
      videoUrl: input.videoUrl,
    },
  });

  res.json({ restaurant });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = restaurantIdParamSchema.parse(req.params);
  const ownerId = req.user!.id;

  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) throw NotFound("restaurant_not_found", "Restaurant introuvable.");
  if (existing.ownerId !== ownerId) {
    throw Forbidden("not_owner", "Ce restaurant ne t'appartient pas.");
  }

  await prisma.restaurant.delete({ where: { id } });
  res.status(204).send();
};
