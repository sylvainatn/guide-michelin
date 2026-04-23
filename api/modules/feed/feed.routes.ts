import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as feedController from "./feed.controller";

export const feedRouter = Router();

feedRouter.get("/", requireAuth, feedController.listFeed);
