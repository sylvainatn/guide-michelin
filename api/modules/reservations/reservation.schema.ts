import { z } from "zod";

export const reservationPaymentMethodSchema = z.enum([
  "APPLE_PAY",
  "GOOGLE_PAY",
  "CARD",
]);

export const reservationEventTypeSchema = z.enum([
  "MARIAGE",
  "EVJF",
  "ANNIVERSAIRE",
  "SAINT_VALENTIN",
]);

export const invitedFriendSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string().optional(),
  initial: z.string(),
  color: z.string(),
  status: z.enum(["invited", "pending", "confirmed"]),
});

export const michelinExtraSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  included: z.boolean(),
  chef: z.string().optional(),
});

export const createReservationSchema = z.object({
  restaurantId: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  nights: z.number().int().min(1),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).optional(),

  roomId: z.string().optional(),
  roomName: z.string().optional(),
  roomCategory: z.string().optional(),

  eventType: reservationEventTypeSchema.nullable().optional(),
  customRequest: z.string().max(2000).optional(),

  invitedFriends: z.array(invitedFriendSchema).optional(),
  michelinExtras: z.array(michelinExtraSchema).optional(),

  paymentMethod: reservationPaymentMethodSchema,
  cardLast4: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  totalAmount: z.number().int().min(0),
  pricePerPerson: z.number().int().min(0),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const reservationIdParamSchema = z.object({
  id: z.cuid(),
});
