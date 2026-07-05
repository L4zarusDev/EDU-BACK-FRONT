"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(150),
    slug: zod_1.z
        .string()
        .min(3)
        .regex(/^[a-z0-9-]+$/),
    description: zod_1.z.string().min(20),
    estimatedHours: zod_1.z.coerce.number().int().positive().optional(),
    categoryId: zod_1.z.string().cuid(),
    isPremium: zod_1.z.coerce.boolean().default(false),
});
exports.updateCourseSchema = exports.createCourseSchema.partial();
