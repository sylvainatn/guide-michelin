import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  address: z.string().trim().min(1).max(500),
  // Peut être une URL externe (https://...) ou un chemin interne servi par Next
  // (ex: "/uploads/videos/xxx.mp4"). Optionnel.
  videoUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
