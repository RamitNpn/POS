import { z } from "zod";

export const BranchStatus = z.enum(["active", "inactive"]);

export const createBranchSchema = z.object({
  name: z.string().trim().min(2).max(100),
  address: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(3).max(30),
  managerName: z.string().trim().optional(),
  status: BranchStatus.default("active"),
  opened: z.string().min(1, "Date is required"),
});

export const branchSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  managerName: z.string().optional(),
  status: z.string().refine((v) => BranchStatus.safeParse(v).success),
  opened: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getAllBranchesSchema = z.array(branchSchema);

export const getBranchByIdSchema = branchSchema;

export const updateBranchSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  address: z.string().trim().min(2).max(255).optional(),
  phone: z.string().trim().min(3).max(30).optional(),
  managerName: z.string().trim().optional(),
  status: BranchStatus.optional(),
  opened: z.string().optional(),
});