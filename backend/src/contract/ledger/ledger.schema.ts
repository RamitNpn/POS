import { z } from "zod";

export const LedgerType = z.enum(["debit", "credit"]);

export const createCreditLedgerSchema = z.object({
  voucherNo: z.string().trim().optional(),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(7).max(20),
  customerEmail: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  date: z.coerce.date(),
  type: LedgerType,
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().trim().max(500).optional(),
  reference: z.string().trim().max(100).optional(),
  remarks: z.string().trim().max(500).optional(),
  createdBy: z.string().optional(),
});

export const creditLedgerSchema = z.object({
  _id: z.string(),
  voucherNo: z.string().optional(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  date: z.date(),
  type: z.string(),
  amount: z.number(),
  description: z.string().optional(),
  reference: z.string().optional(),
  remarks: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getAllCreditLedgerSchema = z.array(creditLedgerSchema);

export const getCreditLedgerByIdSchema = creditLedgerSchema;

export const updateCreditLedgerSchema = z.object({
  voucherNo: z.string().trim().optional(),
  customerName: z.string().trim().min(2).max(100).optional(),
  customerPhone: z.string().trim().min(7).max(20).optional(),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  date: z.coerce.date(),
  type: LedgerType.optional(),
  amount: z.number().positive().optional(),
  description: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
  updatedBy: z.string().optional(),
});
