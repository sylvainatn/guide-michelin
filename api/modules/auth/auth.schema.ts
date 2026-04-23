import { z } from "zod";

export const signupSchema = z.object({
  email: z.email(),
  pseudo: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_.]+$/, "invalid_pseudo"),
  password: z.string().min(8).max(128),
  lastName: z.string().trim().min(1).max(120),
  firstName: z.string().trim().min(1).max(120),
});

export const loginSchema = z.object({
  email: z.email().trim().max(160),
  password: z.string().min(8).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
