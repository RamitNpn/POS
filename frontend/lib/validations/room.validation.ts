import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  isActive: z.enum(["active", "inactive"]),
});

export type TCreateRoomSchema = z.infer<typeof createRoomSchema>;

export const roomSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tableCount: z.number().optional(),
  isActive: z.string().optional(),
});

export const getAllRoomsSchema = z.array(roomSchema);

export type TGetAllRoomSchema = z.infer<typeof getAllRoomsSchema>;

export const getRoomByIdSchema = roomSchema;

export type TGetRoomByIdSchema = z.infer<typeof getRoomByIdSchema>;

export const updateRoomSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  isActive: z.string().optional(),
});

export type TUpdateRoomSchema = z.infer<typeof updateRoomSchema>;

export const deleteRoomSchema = z.object({
  _id: z.string().uuid("Invalid Room ID"),
});

export type TDeleteRoomSchema = z.infer<typeof deleteRoomSchema>;
