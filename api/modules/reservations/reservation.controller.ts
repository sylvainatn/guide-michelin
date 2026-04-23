import type { Request, Response } from "express";
import {
  createReservationSchema,
  reservationIdParamSchema,
} from "./reservation.schema";
import * as reservationService from "./reservation.service";

export const createReservation = async (req: Request, res: Response) => {
  const input = createReservationSchema.parse(req.body);
  const reservation = await reservationService.createReservation(
    req.user!.id,
    input,
  );
  res.status(201).json({ reservation });
};

export const listReservations = async (req: Request, res: Response) => {
  const reservations = await reservationService.listReservations(req.user!.id);
  res.json({ reservations });
};

export const getReservation = async (req: Request, res: Response) => {
  const { id } = reservationIdParamSchema.parse(req.params);
  const reservation = await reservationService.getReservation(
    req.user!.id,
    id,
  );
  res.json({ reservation });
};

export const cancelReservation = async (req: Request, res: Response) => {
  const { id } = reservationIdParamSchema.parse(req.params);
  const reservation = await reservationService.cancelReservation(
    req.user!.id,
    id,
  );
  res.json({ reservation });
};
