import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
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
