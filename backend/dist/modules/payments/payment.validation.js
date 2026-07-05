"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    amount: zod_1.z.coerce.number().positive(),
    months: zod_1.z.coerce.number().int().positive(),
    reference: zod_1.z.string().optional()
});
