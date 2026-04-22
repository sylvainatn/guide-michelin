import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as profileController from "./profile.controller";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, profileController.getMyProfile);
profileRouter.put("/", requireAuth, profileController.updateMyProfile);
