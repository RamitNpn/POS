import { z } from "zod";

export const userData = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
})

export const createActivityLogSchema = z.object({
  userId: z.string().min(1),
  action: z.string().min(1),
  details: z.string().min(1),
  module: z.string().optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
});

export const activityLogSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  user: (userData).optional(),
  action: z.string(),
  details: z.string(),
  module: z.string().optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllActivityLogs = z.array(activityLogSchema);
