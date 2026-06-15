import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateInventorySchema, TDeleteInventorySchema, TGetInventoryByIdSchema } from "../validations/inventory.validation";

export const createInventory = async (data: TCreateInventorySchema) => {
  const res = await apiClient.post("/inventory", data);
  return res.data;
};

const getAllInventoryApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/inventory", {
    params,
  });
  return response.data;
};

const getInventoryByIdApi = async (InventoryId: TGetInventoryByIdSchema["_id"]) => {
  const response = await apiClient.get(`/inventory/${InventoryId}`);
  return response.data;
};

const updateInventoryApi = async (InventoryId: string, formData: FormData) => {
  const response = await apiClient.put(`/inventory/${InventoryId}`, formData, {});
  return response.data;
};

const deleteInventoryApi = async (InventoryId: TDeleteInventorySchema["_id"]) => {
  const response = await apiClient.delete(`/inventory/${InventoryId}`);
  return response.data;
};

export const inventoryApi = {
  createInventory,
  getAllInventoryApi,
  getInventoryByIdApi,
  updateInventoryApi,
  deleteInventoryApi,
};
