import type { Request, Response } from "express";
import {
  createPaymentCardSchema,
  paymentCardIdParamSchema,
} from "./paymentCard.schema";
import * as paymentCardService from "./paymentCard.service";

export const listCards = async (req: Request, res: Response) => {
  const cards = await paymentCardService.listPaymentCards(req.user!.id);
  res.json({ cards });
};

export const createCard = async (req: Request, res: Response) => {
  const input = createPaymentCardSchema.parse(req.body);
  const card = await paymentCardService.createPaymentCard(req.user!.id, input);
  res.status(201).json({ card });
};

export const removeCard = async (req: Request, res: Response) => {
  const { id } = paymentCardIdParamSchema.parse(req.params);
  await paymentCardService.removePaymentCard(req.user!.id, id);
  res.status(204).end();
};
