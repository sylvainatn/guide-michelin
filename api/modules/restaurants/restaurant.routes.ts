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

restaurantRouter.get("/:id", requireAuth, restaurantController.getById);
restaurantRouter.patch("/:id", requireAuth, restaurantController.update);
restaurantRouter.delete("/:id", requireAuth, restaurantController.remove);
