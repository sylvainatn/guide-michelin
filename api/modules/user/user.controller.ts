import type { Request, Response } from "express";
import { changePasswordSchema, updateUserSchema } from "./user.schema";
import * as userService from "./user.service";

export const updateMe = async (req: Request, res: Response) => {
  const input = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(req.user!.id, input);
  res.json({ user });
};

export const changePassword = async (req: Request, res: Response) => {
  const input = changePasswordSchema.parse(req.body);
  await userService.changePassword(req.user!.id, input);
  res.status(204).end();
};
