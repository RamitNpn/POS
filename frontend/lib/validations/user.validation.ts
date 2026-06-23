import { z } from "zod";
export const userRoleEnum = z.enum(["admin", "waiter", "kitchen", "cashier"]);

export const userStatusEnum = z.enum(["active", "inactive", "suspended"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(6, "Password must be atleast 6 character long"),
  role: userRoleEnum,
  profile: z.any().optional(),
  status: userStatusEnum,
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const userSchema = z.object({
  _id: z.string(),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  role: userRoleEnum,
  profile: z.string().optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  status: userStatusEnum.optional(),
  createdAt: z.string().optional(),
});

export const getAllUsersSchema = z.array(userSchema);

export type TGetAllUserSchema = z.infer<typeof getAllUsersSchema>;

export const getUserByIdSchema = userSchema;

export type TGetUserByIdSchema = z.infer<typeof getUserByIdSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email().optional(),
  role: userRoleEnum.optional(),
  profile: z.any().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  status: userStatusEnum.optional(),
});

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = z.object({
  _id: z.string().uuid("Invalid user ID"),
});

export type TDeleteUserSchema = z.infer<typeof deleteUserSchema>;
