import { z } from "zod";

export const createPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  months: z.coerce.number().int().positive(),
  reference: z.string().optional()
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;