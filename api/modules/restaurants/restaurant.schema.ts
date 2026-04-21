import { z } from "zod";

export const restaurantIdParamSchema = z.object({
  id: z.string().min(1),
});

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  address: z.string().trim().min(1).max(500),
  // URL externe (https://...) ou chemin interne servi par Next (ex: "/uploads/videos/xxx.mp4").
  videoUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

// En update, tous les champs sont optionnels. `videoUrl` accepte aussi `null`
// pour supprimer la vidéo existante.
export const updateRestaurantSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    address: z.string().trim().min(1).max(500).optional(),
    videoUrl: z
      .union([z.string().trim().max(2000), z.null()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        if (v === null || v === "") return null;
        return v;
      }),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Au moins un champ doit être fourni.",
  });

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
