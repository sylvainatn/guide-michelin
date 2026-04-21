import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as restaurantController from "./restaurant.controller";
import { uploadVideo, videoUploadMiddleware } from "./restaurant.upload";

export const restaurantRouter = Router();

restaurantRouter.post("/", requireAuth, restaurantController.create);
restaurantRouter.get("/", requireAuth, restaurantController.listMine);
restaurantRouter.post(
  "/video",
  requireAuth,
  videoUploadMiddleware,
  uploadVideo,
);
