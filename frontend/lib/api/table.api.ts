import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateTableSchema, TDeleteTableSchema, TGetTableByIdSchema } from "../validations/table.validation";

export const createTable = async (data: TCreateTableSchema) => {
  const res = await apiClient.post("/table", data);
  return res.data;
};

const getAllTableApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/table", {
    params,
  });
  return response.data;
};

const getTableByIdApi = async (TableId: TGetTableByIdSchema["_id"]) => {
  const response = await apiClient.get(`/table/${TableId}`);
  return response.data;
};

const updateTableApi = async (TableId: string, formData: FormData) => {
  const response = await apiClient.put(`/table/${TableId}`, formData, {});
  return response.data;
};

const deleteTableApi = async (TableId: TDeleteTableSchema["_id"]) => {
  const response = await apiClient.delete(`/table/${TableId}`);
  return response.data;
};

export const tableApi = {
  createTable,
  getAllTableApi,
  getTableByIdApi,
  updateTableApi,
  deleteTableApi,
};
