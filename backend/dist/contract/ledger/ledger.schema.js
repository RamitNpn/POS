"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreditLedgerSchema = exports.getCreditLedgerByIdSchema = exports.getAllCreditLedgerSchema = exports.creditLedgerSchema = exports.createCreditLedgerSchema = exports.LedgerType = void 0;
const zod_1 = require("zod");
exports.LedgerType = zod_1.z.enum(["debit", "credit"]);
exports.createCreditLedgerSchema = zod_1.z.object({
    voucherNo: zod_1.z.string().trim().optional(),
    customerName: zod_1.z.string().trim().min(2).max(100),
    customerPhone: zod_1.z.string().trim().min(7).max(20),
    customerEmail: zod_1.z
        .string()
        .trim()
        .email("Invalid email address")
        .optional()
        .or(zod_1.z.literal("")),
    date: zod_1.z.coerce.date(),
    type: exports.LedgerType,
    amount: zod_1.z.number().positive("Amount must be greater than zero"),
    description: zod_1.z.string().trim().max(500).optional(),
    reference: zod_1.z.string().trim().max(100).optional(),
    remarks: zod_1.z.string().trim().max(500).optional(),
    createdBy: zod_1.z.string().optional(),
});
exports.creditLedgerSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    voucherNo: zod_1.z.string().optional(),
    customerName: zod_1.z.string(),
    customerPhone: zod_1.z.string(),
    customerEmail: zod_1.z.string().optional(),
    date: zod_1.z.date(),
    type: zod_1.z.string(),
    amount: zod_1.z.number(),
    description: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().optional(),
    updatedBy: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.getAllCreditLedgerSchema = zod_1.z.array(exports.creditLedgerSchema);
exports.getCreditLedgerByIdSchema = exports.creditLedgerSchema;
exports.updateCreditLedgerSchema = zod_1.z.object({
    voucherNo: zod_1.z.string().trim().optional(),
    customerName: zod_1.z.string().trim().min(2).max(100).optional(),
    customerPhone: zod_1.z.string().trim().min(7).max(20).optional(),
    customerEmail: zod_1.z.string().trim().email().optional().or(zod_1.z.literal("")),
    date: zod_1.z.coerce.date(),
    type: exports.LedgerType.optional(),
    amount: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().trim().optional(),
    reference: zod_1.z.string().trim().optional(),
    remarks: zod_1.z.string().trim().optional(),
    updatedBy: zod_1.z.string().optional(),
});
