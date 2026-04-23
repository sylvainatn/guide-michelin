import { Router } from "express";
import { createImageUpload, createVideoUpload } from "../../lib/upload";
import { requireAdmin } from "../../middleware/require-admin";
import { requireAuth } from "../../middleware/require-auth";
import * as accommodationController from "./accommodation.controller";

export const accommodationRouter = Router();

const videoUpload = createVideoUpload("accommodation");
const imageUpload = createImageUpload("accommodation");

// Admin-only — déclarés avant les routes `/:id` pour que `/video` et `/image`
// ne matchent pas le paramètre `id`.
accommodationRouter.post(
  "/video",
  requireAuth,
  requireAdmin,
  videoUpload.middleware,
  videoUpload.handler,
);
accommodationRouter.post(
  "/image",
  requireAuth,
  requireAdmin,
  imageUpload.middleware,
  imageUpload.handler,
);

// Fiche publique (utilisateur authentifié).
accommodationRouter.get(
  "/:id",
  requireAuth,
  accommodationController.getById,
);

// Admin-only : gestion.
accommodationRouter.get(
  "/",
  requireAuth,
  requireAdmin,
  accommodationController.listMine,
);
accommodationRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  accommodationController.create,
);
accommodationRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  accommodationController.update,
);
accommodationRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  accommodationController.remove,
);
