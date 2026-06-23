"use client";

import { activityLogApi } from "@/lib/api/log.api";
import { useQuery } from "@tanstack/react-query";

export function useActivityLogById(logId: string) {
  return useQuery({
    queryKey: ["activity-log", logId],
    queryFn: () => activityLogApi.getActivityLogByIdApi(logId),
    enabled: !!logId,
  });
}