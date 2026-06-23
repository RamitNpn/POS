"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivityLogs = exports.activityLogSchema = exports.createActivityLogSchema = exports.userData = void 0;
const zod_1 = require("zod");
exports.userData = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    role: zod_1.z.string(),
});
exports.createActivityLogSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    action: zod_1.z.string().min(1),
    details: zod_1.z.string().min(1),
    module: zod_1.z.string().optional(),
    entityId: zod_1.z.string().optional(),
    entityType: zod_1.z.string().optional(),
});
exports.activityLogSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    userId: zod_1.z.string(),
    user: (exports.userData).optional(),
    action: zod_1.z.string(),
    details: zod_1.z.string(),
    module: zod_1.z.string().optional(),
    entityId: zod_1.z.string().optional(),
    entityType: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.getAllActivityLogs = zod_1.z.array(exports.activityLogSchema);
