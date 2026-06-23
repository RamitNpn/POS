import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";

const getActivityLogsApi = async (
  params: UsePaginationParams & {
    module?: string;
    userId?: string;
  },
) => {
  const response = await apiClient.get("/activity-log", {
    params,
  });

  return response.data;
};

const getActivityLogByIdApi = async (logId: string) => {
  const response = await apiClient.get(`/activity-log/${logId}`);
  return response.data;
};

const deleteActivityLogApi = async (logId: string) => {
  const response = await apiClient.delete(`/activity-log/${logId}`);
  return response.data;
};

export const activityLogApi = {
  getActivityLogsApi,
  getActivityLogByIdApi,
  deleteActivityLogApi,
};
