import { apiClient } from "@/utils/apiClient";

import { UsePaginationParams } from "../types/usePagination";


const getAllDailyReportApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/reports/daily", {
    params,
  });
  return response.data;
};

export const reportApi = {
  getAllDailyReportApi,
};
