import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100),

  description: z
    .string()
    .optional(),

  order: z.coerce
    .number()
    .int()
    .default(0)
});

export const updateCategorySchema =
  createCategorySchema.partial();

export type CreateCategoryInput =
  z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput =
  z.infer<typeof updateCategorySchema>;