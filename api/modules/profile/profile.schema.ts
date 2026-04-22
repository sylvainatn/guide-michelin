import { z } from "zod";

const Environment = z.enum(["SEA", "MOUNTAINS", "VINEYARDS", "CITY"]);
const Cuisine = z.enum(["TRADITION", "CREATIVITY", "ECO"]);
const TravelStyle = z.enum(["GASTRONOMIC", "ADVENTURE", "CULTURE", "ROMANCE"]);
const TravelPace = z.enum(["SLOW", "ROADTRIP"]);
const TripDuration = z.enum([
  "ONE_NIGHT",
  "SHORT_BREAK",
  "ONE_WEEK",
  "EXTENDED",
]);
const BudgetTier = z.enum(["DISCOVERY", "EXCELLENCE", "PRESTIGE"]);

export const updateProfileSchema = z.object({
  age: z.number().int().min(13).max(120).optional(),
  environments: z.array(Environment).max(4).optional(),
  cuisines: z.array(Cuisine).max(3).optional(),
  travelStyle: TravelStyle.optional(),
  travelPace: TravelPace.optional(),
  tripDuration: TripDuration.optional(),
  budgetPerNight: z.number().int().min(50).max(10000).optional(),
  budgetTier: BudgetTier.optional(),
  completed: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
