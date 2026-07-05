import { z } from "zod";

export const createLessonSchema = z.object({
  title: z
    .string()
    .min(3, "El título es obligatorio.")
    .max(150),

  description: z.string().optional(),

  videoUrl: z.string().url().optional().or(z.literal("")),

  pdfUrl: z.string().url().optional().or(z.literal("")),

  duration: z.coerce.number().int().positive().optional(),

  order: z.coerce.number().int().min(1).default(1),

  published: z.coerce.boolean().default(false),

  isPreview: z.coerce.boolean().default(false),
});

export const updateLessonSchema =
  createLessonSchema.partial();

export type CreateLessonInput =
  z.infer<typeof createLessonSchema>;

export type UpdateLessonInput =
  z.infer<typeof updateLessonSchema>;