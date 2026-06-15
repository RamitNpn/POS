import { apiClient } from "@/utils/apiClient";
import {
  TCreateUserSchema,
  TDeleteUserSchema,
  TGetUserByIdSchema,
} from "../validations/user.validation";
import { UsePaginationParams } from "../types/usePagination";

export const createUser = async (data: TCreateUserSchema) => {
  const res = await apiClient.post("/user", data);
  return res.data;
};

const getAllUserApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/user", {
    params,
  });
  return response.data;
};

const getUserByIdApi = async (UserId: TGetUserByIdSchema["_id"]) => {
  const response = await apiClient.get(`/user/${UserId}`);
  return response.data;
};

const updateUserApi = async (UserId: string, formData: FormData) => {
  const response = await apiClient.put(`/user/${UserId}`, formData, {});

  return response.data;
};

const deleteUserApi = async (UserId: TDeleteUserSchema["_id"]) => {
  const response = await apiClient.delete(`/user/${UserId}`);
  return response.data;
};

export const userApi = {
  createUser,
  getAllUserApi,
  getUserByIdApi,
  updateUserApi,
  deleteUserApi,
};
