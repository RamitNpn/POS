import { apiClient } from "@/utils/apiClient";

import { UsePaginationParams } from "../types/usePagination";
import {
  TCreateBranchSchema,
  TDeleteBranchSchema,
  TGetBranchByIdSchema,
  TUpdateBranchSchema,
} from "../validations/branch.validation";

export const createBranch = async (data: TCreateBranchSchema) => {
  const res = await apiClient.post("/branch", data);
  return res.data;
};

const getAllBranchApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/branch", {
    params,
  });
  return response.data;
};

const getBranchByIdApi = async (branchId: string) => {
  const response = await apiClient.get(`/branch/${branchId}`);
  return response.data;
};

const updateBranchApi = async (branchId: string, data: TUpdateBranchSchema) => {
  const response = await apiClient.put(`/branch/${branchId}`, data);

  return response.data;
};

const deleteBranchApi = async (branchId: TDeleteBranchSchema["_id"]) => {
  const response = await apiClient.delete(`/branch/${branchId}`);
  return response.data;
};

export const branchApi = {
  createBranch,
  getAllBranchApi,
  getBranchByIdApi,
  updateBranchApi,
  deleteBranchApi,
};
