import { z } from "zod";

export const cardBrandSchema = z.enum(["VISA", "MASTERCARD", "CARD"]);

export const createPaymentCardSchema = z.object({
  brand: cardBrandSchema,
  last4: z.string().regex(/^\d{4}$/, "invalid_last4"),
  holder: z.string().trim().min(2).max(120),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int().min(24).max(99),
});

export type CreatePaymentCardInput = z.infer<typeof createPaymentCardSchema>;

export const paymentCardIdParamSchema = z.object({
  id: z.cuid(),
});
