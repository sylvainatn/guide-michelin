import type { Request, Response } from "express";
import { restaurantIdParamSchema } from "./interaction.schema";
import * as interactionService from "./interaction.service";

export const addBookmark = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { restaurantId } = restaurantIdParamSchema.parse(req.params);
  await interactionService.addBookmark(userId, restaurantId);
  res.json({ restaurantId, bookmarked: true });
};

export const removeBookmark = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { restaurantId } = restaurantIdParamSchema.parse(req.params);
  await interactionService.removeBookmark(userId, restaurantId);
  res.json({ restaurantId, bookmarked: false });
};

export const addFavorite = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { restaurantId } = restaurantIdParamSchema.parse(req.params);
  await interactionService.addFavorite(userId, restaurantId);
  res.json({ restaurantId, favorited: true });
};

export const removeFavorite = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { restaurantId } = restaurantIdParamSchema.parse(req.params);
  await interactionService.removeFavorite(userId, restaurantId);
  res.json({ restaurantId, favorited: false });
};
