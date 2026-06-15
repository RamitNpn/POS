import { apiClient } from "@/utils/apiClient";

import { UsePaginationParams } from "../types/usePagination";
import { TCreateRoomSchema, TDeleteRoomSchema, TGetRoomByIdSchema, TUpdateRoomSchema } from "../validations/room.validation";

export const createRoom = async (data: TCreateRoomSchema) => {
  const res = await apiClient.post("/room", data);
  return res.data;
};

const getAllRoomApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/room", {
    params,
  });
  return response.data;
};

const getRoomByIdApi = async (RoomId: TGetRoomByIdSchema["_id"]) => {
  const response = await apiClient.get(`/room/${RoomId}`);
  return response.data;
};

const updateRoomApi = async (RoomId: string, data: TUpdateRoomSchema) => {
  const response = await apiClient.put(`/room/${RoomId}`, data);

  return response.data;
};

const deleteRoomApi = async (RoomId: TDeleteRoomSchema["_id"]) => {
  const response = await apiClient.delete(`/room/${RoomId}`);
  return response.data;
};

export const roomApi = {
  createRoom,
  getAllRoomApi,
  getRoomByIdApi,
  updateRoomApi,
  deleteRoomApi,
};
