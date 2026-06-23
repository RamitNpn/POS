"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchSchema = exports.getBranchByIdSchema = exports.getAllBranchesSchema = exports.branchSchema = exports.createBranchSchema = exports.BranchStatus = void 0;
const zod_1 = require("zod");
exports.BranchStatus = zod_1.z.enum(["active", "inactive"]);
exports.createBranchSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    address: zod_1.z.string().trim().min(2).max(255),
    phone: zod_1.z.string().trim().min(3).max(30),
    managerName: zod_1.z.string().trim().optional(),
    status: exports.BranchStatus.default("active"),
    opened: zod_1.z.string().min(1, "Date is required"),
});
exports.branchSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    address: zod_1.z.string(),
    phone: zod_1.z.string(),
    managerName: zod_1.z.string().optional(),
    status: zod_1.z.string().refine((v) => exports.BranchStatus.safeParse(v).success),
    opened: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.getAllBranchesSchema = zod_1.z.array(exports.branchSchema);
exports.getBranchByIdSchema = exports.branchSchema;
exports.updateBranchSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100).optional(),
    address: zod_1.z.string().trim().min(2).max(255).optional(),
    phone: zod_1.z.string().trim().min(3).max(30).optional(),
    managerName: zod_1.z.string().trim().optional(),
    status: exports.BranchStatus.optional(),
    opened: zod_1.z.string().optional(),
});
