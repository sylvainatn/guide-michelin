import type { Request, Response } from "express";
import { updateProfileSchema } from "./profile.schema";
import * as profileService from "./profile.service";

export const getMyProfile = async (req: Request, res: Response) => {
  const profile = await profileService.getProfile(req.user!.id);
  res.json({ profile });
};

export const updateMyProfile = async (req: Request, res: Response) => {
  const input = updateProfileSchema.parse(req.body);
  const profile = await profileService.upsertProfile(req.user!.id, input);
  res.json({ profile });
};
