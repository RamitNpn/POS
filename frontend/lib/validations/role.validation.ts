import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  isActive: z.enum(["active", "inactive"]),
});

export type TCreateRoleSchema = z.infer<typeof createRoleSchema>;

export const roleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  userCount: z.number().optional(),
  isActive: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getAllRolesSchema = z.array(roleSchema);

export type TGetAllRoleSchema = z.infer<typeof getAllRolesSchema>;

export const getRoleByIdSchema = roleSchema;

export type TGetRoleByIdSchema = z.infer<typeof getRoleByIdSchema>;

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  isActive: z.string().optional(),
});

export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const deleteRoleSchema = z.object({
  _id: z.string().uuid("Invalid role ID"),
});

export type TDeleteRoleSchema = z.infer<typeof deleteRoleSchema>;
