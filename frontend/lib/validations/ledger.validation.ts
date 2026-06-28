import { z } from "zod";

export const LedgerType = z.enum(["debit", "credit"]);

export const createLedgerSchema = z.object({
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

export type TCreateLedgerSchema = z.infer<typeof createLedgerSchema>;

export const ledgerSchema = z.object({
  _id: z.string(),
  voucherNo: z.string().optional(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  date: z.date(),
  type: z.string().optional(),
  amount: z.number(),
  description: z.string().optional(),
  reference: z.string().optional(),
  remarks: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getAllLedgerSchema = z.array(ledgerSchema);

export type TGetAllLedgerSchema = z.infer<typeof getAllLedgerSchema>;

export const getLedgerByIdSchema = ledgerSchema;

export type TGetLedgerByIdSchema = z.infer<typeof getLedgerByIdSchema>;

export const updateLedgerSchema = z.object({
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

export type TUpdateLedgerSchema = z.infer<typeof updateLedgerSchema>;

export const deleteLedgerSchema = z.object({
  _id: z.string(),
});

export type TDeleteLedgerSchema = z.infer<typeof deleteLedgerSchema>;
