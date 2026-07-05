"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100),
    description: zod_1.z
        .string()
        .optional(),
    order: zod_1.z.coerce
        .number()
        .int()
        .default(0)
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
