import { z } from "zod";

export const accommodationCategorySchema = z.enum([
  "HOTEL",
  "BED_AND_BREAKFAST",
  "CHALET",
  "VILLA",
  "APARTMENT",
  "RESORT",
]);

export const createAccommodationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  address: z.string().trim().min(1).max(500),
  category: accommodationCategorySchema,
  stars: z.number().int().min(0).max(5).optional(),
  priceFromEur: z.number().int().min(0).max(100000).optional(),
  mainImageUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  videoUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  video360: z.boolean().optional(),
  amenities: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  photos: z.array(z.string().trim().max(2000)).max(20).optional(),
});

export type CreateAccommodationInput = z.infer<
  typeof createAccommodationSchema
>;

export const updateAccommodationSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    address: z.string().trim().min(1).max(500).optional(),
    category: accommodationCategorySchema.optional(),
    stars: z.union([z.number().int().min(0).max(5), z.null()]).optional(),
    priceFromEur: z
      .union([z.number().int().min(0).max(100000), z.null()])
      .optional(),
    mainImageUrl: z
      .union([z.string().trim().max(2000), z.null()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        if (v === null) return null;
        return v.length > 0 ? v : null;
      }),
    videoUrl: z
      .union([z.string().trim().max(2000), z.null()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        if (v === null) return null;
        return v.length > 0 ? v : null;
      }),
    video360: z.boolean().optional(),
    amenities: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
    photos: z.array(z.string().trim().max(2000)).max(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit etre fourni.",
  });

export type UpdateAccommodationInput = z.infer<
  typeof updateAccommodationSchema
>;

export const accommodationIdParamSchema = z.object({
  id: z.cuid(),
});
