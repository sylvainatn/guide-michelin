import { z } from "zod";

export const restaurantIdParamSchema = z.object({
  restaurantId: z.cuid(),
});

export type RestaurantIdParam = z.infer<typeof restaurantIdParamSchema>;
