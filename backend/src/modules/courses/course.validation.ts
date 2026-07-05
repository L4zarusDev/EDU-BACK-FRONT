import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5).max(150),

  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),

  description: z.string().min(20),

  estimatedHours: z.coerce.number().int().positive().optional(),

  categoryId: z.string().cuid(),

  isPremium: z.coerce.boolean().default(false),
});

export const updateCourseSchema =
  createCourseSchema.partial();

export type CreateCourseInput =
  z.infer<typeof createCourseSchema>;

export type UpdateCourseInput =
  z.infer<typeof updateCourseSchema>;