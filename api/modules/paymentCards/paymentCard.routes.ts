import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as paymentCardController from "./paymentCard.controller";

export const paymentCardRouter = Router();

paymentCardRouter.get("/", requireAuth, paymentCardController.listCards);
paymentCardRouter.post("/", requireAuth, paymentCardController.createCard);
paymentCardRouter.delete("/:id", requireAuth, paymentCardController.removeCard);
