import { z } from "zod";

export const Status =  z.enum(["active", "inactive"]);

export const createRoleSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  isActive: Status.default("active"),
});

export const roleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  userCount: z.number(),
  isActive: z.string().refine((v) => Status.safeParse(v).success),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getAllRolesSchema = z.array(roleSchema);

export const getRoleByIdSchema = roleSchema;

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  isActive: Status.optional(),
});