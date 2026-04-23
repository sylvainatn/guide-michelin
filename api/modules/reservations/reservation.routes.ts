import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth";
import * as reservationController from "./reservation.controller";

export const reservationRouter = Router();

reservationRouter.get("/", requireAuth, reservationController.listReservations);
reservationRouter.post("/", requireAuth, reservationController.createReservation);
reservationRouter.get(
  "/:id",
  requireAuth,
  reservationController.getReservation,
);
reservationRouter.delete(
  "/:id",
  requireAuth,
  reservationController.cancelReservation,
);
