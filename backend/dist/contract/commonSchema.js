"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorSchema = exports.successSchema = void 0;
const zod_1 = require("zod");
exports.successSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string().optional(),
});
exports.errorSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    error: zod_1.z.string(),
});
