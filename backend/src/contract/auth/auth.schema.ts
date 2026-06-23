import { z } from "zod";

export const userRoleEnum = z.enum(["admin", "waiter", "kitchen", "cashier"]);

export const userStatusEnum = z.enum(["active", "inactive", "suspended"]);

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