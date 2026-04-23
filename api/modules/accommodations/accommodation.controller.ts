import type { Request, Response } from "express";
import {
  accommodationIdParamSchema,
  createAccommodationSchema,
  updateAccommodationSchema,
} from "./accommodation.schema";
import * as accommodationService from "./accommodation.service";

export const listMine = async (req: Request, res: Response) => {
  const accommodations = await accommodationService.listOwn(req.user!.id);
  res.json({ accommodations });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = accommodationIdParamSchema.parse(req.params);
  const accommodation = await accommodationService.getById(id);
  res.json({ accommodation });
};

export const create = async (req: Request, res: Response) => {
  const input = createAccommodationSchema.parse(req.body);
  const accommodation = await accommodationService.create(req.user!.id, input);
  res.status(201).json({ accommodation });
};

export const update = async (req: Request, res: Response) => {
  const { id } = accommodationIdParamSchema.parse(req.params);
  const input = updateAccommodationSchema.parse(req.body);
  const accommodation = await accommodationService.update(
    id,
    req.user!.id,
    input,
  );
  res.json({ accommodation });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = accommodationIdParamSchema.parse(req.params);
  await accommodationService.remove(id, req.user!.id);
  res.status(204).end();
};
