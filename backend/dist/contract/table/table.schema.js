"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableStatusSchema = exports.updateTableSchema = exports.getAllTablesSchema = exports.getTableByIdSchema = exports.tableSchema = exports.createTableSchema = exports.tableStatusEnum = void 0;
const zod_1 = require("zod");
exports.tableStatusEnum = zod_1.z.enum([
    "available",
    "occupied",
    "reserved"
]);
exports.createTableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    capacity: zod_1.z.number().min(1),
    status: exports.tableStatusEnum.optional(),
    sectionId: zod_1.z.string().optional(),
});
exports.tableSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    capacity: zod_1.z.number(),
    status: exports.tableStatusEnum,
    section: zod_1.z.string(),
    sectionId: zod_1.z.string().optional(),
});
exports.getTableByIdSchema = exports.tableSchema;
exports.getAllTablesSchema = zod_1.z.array(exports.tableSchema);
exports.updateTableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    capacity: zod_1.z.number().min(1).optional(),
    status: exports.tableStatusEnum.optional(),
    sectionId: zod_1.z.string().optional(),
});
exports.updateTableStatusSchema = zod_1.z.object({
    status: exports.tableStatusEnum.optional(),
});
