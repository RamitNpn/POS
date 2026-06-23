import { apiClient } from "@/utils/apiClient";

import { UsePaginationParams } from "../types/usePagination";

const getAllSalesApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/sales", {
    params,
  });
  return response.data;
};

const getTopSellingItemsApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/sales/items", {
    params,
  });
  return response.data;
};

export const salesApi = {
  getAllSalesApi,
  getTopSellingItemsApi,
};
