"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.updateUserSchema = exports.getUserByIdSchema = exports.getAllUsersSchema = exports.getMeResponseSchema = exports.logoutResponseSchema = exports.loginResponseSchema = exports.loginSchema = exports.userSchema = exports.createUserSchema = exports.userStatusEnum = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
exports.userRoleEnum = zod_1.z.enum(["admin", "waiter", "kitchen", "cashier"]);
exports.userStatusEnum = zod_1.z.enum(["active", "inactive", "suspended"]);
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().trim().email("Invalid email address"),
    role: exports.userRoleEnum,
    profile: zod_1.z.any().optional(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().trim().min(7).max(20),
    status: exports.userStatusEnum.optional(),
});
exports.userSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().trim().email("Invalid email address"),
    role: exports.userRoleEnum,
    profile: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    status: exports.userStatusEnum.optional(),
    createdAt: zod_1.z.date().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.loginResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    user: exports.userSchema,
});
exports.logoutResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
exports.getMeResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    user: exports.userSchema,
});
exports.getAllUsersSchema = zod_1.z.array(exports.userSchema);
exports.getUserByIdSchema = exports.userSchema;
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100).optional(),
    email: zod_1.z.string().email().optional(),
    role: exports.userRoleEnum.optional(),
    profile: zod_1.z.any().optional(),
    password: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(7).max(20).optional(),
    status: exports.userStatusEnum.optional(),
});
exports.deleteUserSchema = zod_1.z.object({
    _id: zod_1.z.string(),
});
