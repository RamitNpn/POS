import { z } from "zod";
export const userRoleEnum = z.enum(["admin", "waiter", "kitchen", "cashier"]);

export const userStatusEnum = z.enum(["active", "inactive", "suspended"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: userRoleEnum,
  profile: z.any().optional(),
  password: z.string().min(6),
  phone: z.string().trim().min(7).max(20),
  status: userStatusEnum.optional(),
});

export const userSchema = z.object({
  _id: z.string(),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: userRoleEnum,
  profile: z.string().optional(),
  phone: z.string().optional(),
  status: userStatusEnum.optional(),
  createdAt: z.date().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userSchema,
});

export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const getMeResponseSchema = z.object({
  success: z.boolean(),
  user: userSchema,
});

export const getAllUsersSchema = z.array(userSchema);

export const getUserByIdSchema = userSchema;

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: userRoleEnum.optional(),
  profile: z.any().optional(),
  password: z.string().optional(),
  phone: z.string().min(7).max(20).optional(),
  status: userStatusEnum.optional(),
});

export const deleteUserSchema = z.object({
    _id: z.string(),
});
