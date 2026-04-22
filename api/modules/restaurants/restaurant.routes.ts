import { Router } from "express";
import { requireAdmin } from "../../middleware/require-admin";
import { requireAuth } from "../../middleware/require-auth";
import * as restaurantController from "./restaurant.controller";
import { uploadVideo, videoUploadMiddleware } from "./restaurant.upload";

export const restaurantRouter = Router();

// Public to any authenticated user (USER + ADMIN) — feed des vidéos.
restaurantRouter.get("/feed", requireAuth, restaurantController.listFeed);

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
  videoUploadMiddleware,
  uploadVideo,
);
