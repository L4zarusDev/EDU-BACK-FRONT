"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLessonSchema = exports.createLessonSchema = void 0;
const zod_1 = require("zod");
exports.createLessonSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "El título es obligatorio.")
        .max(150),
    description: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    pdfUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    duration: zod_1.z.coerce.number().int().positive().optional(),
    order: zod_1.z.coerce.number().int().min(1).default(1),
    published: zod_1.z.coerce.boolean().default(false),
    isPreview: zod_1.z.coerce.boolean().default(false),
});
exports.updateLessonSchema = exports.createLessonSchema.partial();
