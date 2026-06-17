"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.getRoomByIdSchema = exports.getAllRoomsSchema = exports.roomSchema = exports.createRoomSchema = exports.Status = void 0;
const zod_1 = require("zod");
exports.Status = zod_1.z.enum(["active", "inactive"]);
exports.createRoomSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    description: zod_1.z.string().trim().optional(),
    isActive: exports.Status.default("active"),
});
exports.roomSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    tableCount: zod_1.z.number(),
    isActive: zod_1.z.string().refine((v) => exports.Status.safeParse(v).success),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.getAllRoomsSchema = zod_1.z.array(exports.roomSchema);
exports.getRoomByIdSchema = exports.roomSchema;
exports.updateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100).optional(),
    description: zod_1.z.string().trim().optional(),
    isActive: exports.Status.optional(),
});
