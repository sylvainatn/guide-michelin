import { Router } from "express";
import { createImageUpload, createVideoUpload } from "../../lib/upload";
import { requireAdmin } from "../../middleware/require-admin";
import { requireAuth } from "../../middleware/require-auth";
import * as restaurantController from "./restaurant.controller";

export const restaurantRouter = Router();

const videoUpload = createVideoUpload("restaurant");
const imageUpload = createImageUpload("restaurant");

// Fiche restaurant (accessible a tout utilisateur authentifie).
restaurantRouter.get("/:id", requireAuth, restaurantController.getById);

// Admin-only : gestion des établissements.
restaurantRouter.post("/", requireAuth, requireAdmin, restaurantController.create);
restaurantRouter.get("/", requireAuth, requireAdmin, restaurantController.listMine);
restaurantRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  restaurantController.update,
);
restaurantRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  restaurantController.remove,
);
restaurantRouter.post(
  "/video",
  requireAuth,
  requireAdmin,
  videoUpload.middleware,
  videoUpload.handler,
);
restaurantRouter.post(
  "/image",
  requireAuth,
  requireAdmin,
  imageUpload.middleware,
  imageUpload.handler,
);
