import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as userController from "./user.controller";

export const userRouter = Router();

userRouter.patch("/", requireAuth, userController.updateMe);
userRouter.post("/password", requireAuth, userController.changePassword);
