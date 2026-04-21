import { z } from "zod";

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(120).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
