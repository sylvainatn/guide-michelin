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
  chefName: z.string().trim().min(1).max(200).optional(),
  stars: z.number().int().min(0).max(3).optional(),
  priceRange: z.enum(["EUR", "EUREUR", "EUREUREUR", "EUREUREUREUR"]).optional(),
  style: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

// PATCH /restaurants/:id — tous les champs sont optionnels, mais au moins un
// doit etre fourni. On distingue explicitement "champ absent" (pas de mise a
// jour) et "champ null / chaine vide" (effacement de la valeur).
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
        if (v === null) return null;
        return v.length > 0 ? v : null;
      }),
    chefName: z
      .union([z.string().trim().max(200), z.null()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        if (v === null) return null;
        return v.length > 0 ? v : null;
      }),
    stars: z.union([z.number().int().min(0).max(3), z.null()]).optional(),
    priceRange: z
      .union([z.enum(["EUR", "EUREUR", "EUREUREUR", "EUREUREUREUR"]), z.null()])
      .optional(),
    style: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit etre fourni.",
  });

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
