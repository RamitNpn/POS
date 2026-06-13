import { z } from "zod";
export const userRoleEnum = z.enum(["admin", "waiter", "kitchen", "cashier"]);

export const userStatusEnum = z.enum(["active", "inactive", "suspended"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: userRoleEnum,
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  status: userStatusEnum.optional(),
});

export const userSchema = z.object({
  _id: z.string(),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: userRoleEnum,
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  status: userStatusEnum.optional(),
});

export const getAllUsersSchema = z.array(userSchema);

export const getUserByIdSchema = userSchema;

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: userRoleEnum.optional(),
  avatar: z.string().url().optional(),
  phone: z.string().min(7).max(20).optional(),
  status: userStatusEnum.optional(),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
});
