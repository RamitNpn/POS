import { z } from "zod";

export const Status =  z.enum(["active", "inactive"]);

export const createRoomSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  isActive: Status.default("active"),
});

export const roomSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tableCount: z.number(),
  isActive: z.string().refine((v) => Status.safeParse(v).success),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getAllRoomsSchema = z.array(roomSchema);

export const getRoomByIdSchema = roomSchema;

export const updateRoomSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  isActive: Status.optional(),
});