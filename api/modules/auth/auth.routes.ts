import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { authLimiter, signupLimiter } from "../../middleware/rate-limit";
import * as authController from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", signupLimiter, authController.signup);
authRouter.post("/login", authLimiter, authController.login);
authRouter.post("/refresh", authLimiter, authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);
authRouter.get("/verify-session", authController.verifySession);
