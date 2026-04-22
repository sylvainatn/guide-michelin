import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as interactionController from "./interaction.controller";

export const interactionRouter = Router();

interactionRouter.put(
  "/bookmarks/:restaurantId",
  requireAuth,
  interactionController.addBookmark,
);
interactionRouter.delete(
  "/bookmarks/:restaurantId",
  requireAuth,
  interactionController.removeBookmark,
);
interactionRouter.put(
  "/favorites/:restaurantId",
  requireAuth,
  interactionController.addFavorite,
);
interactionRouter.delete(
  "/favorites/:restaurantId",
  requireAuth,
  interactionController.removeFavorite,
);
