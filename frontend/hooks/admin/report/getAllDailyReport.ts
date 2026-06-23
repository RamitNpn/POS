"use client";

import { reportApi } from "@/lib/api/report.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllReports({ page = 1, limit = 10, from, to }: UsePaginationParams) {
  return useQuery({
    queryKey: ["reports", page, limit, from, to],
    queryFn: () => reportApi.getAllDailyReportApi({page, limit, from, to}),  
  });
}