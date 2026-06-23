import { apiClient } from "@/utils/apiClient";

import { UsePaginationParams } from "../types/usePagination";
import { TCreateRoleSchema, TDeleteRoleSchema, TGetRoleByIdSchema, TUpdateRoleSchema } from "../validations/role.validation";

export const createRole = async (data: TCreateRoleSchema) => {
  const res = await apiClient.post("/role", data);
  return res.data;
};

const getAllRoleApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/role", {
    params,
  });
  return response.data;
};

const getRoleByIdApi = async (roleId: TGetRoleByIdSchema["_id"]) => {
  const response = await apiClient.get(`/role/${roleId}`);
  return response.data;
};

const updateRoleApi = async (roleId: string, data: TUpdateRoleSchema) => {
  const response = await apiClient.put(`/role/${roleId}`, data);

  return response.data;
};

const deleteRoleApi = async (roleId: TDeleteRoleSchema["_id"]) => {
  const response = await apiClient.delete(`/role/${roleId}`);
  return response.data;
};

export const roleApi = {
  createRole,
  getAllRoleApi,
  getRoleByIdApi,
  updateRoleApi,
  deleteRoleApi,
};
