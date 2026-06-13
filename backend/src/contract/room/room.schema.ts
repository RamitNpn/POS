import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  tableCount: z.number().min(0).default(0),
  isActive: z.boolean().optional(),
});

export const roomSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tableCount: z.number(),
  isActive: z.boolean(),
});

export const getAllRoomsSchema = z.array(roomSchema);

export const getRoomByIdSchema = roomSchema;
export const updateRoomSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  tableCount: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});