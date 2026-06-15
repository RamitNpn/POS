"use client";

import { tableApi } from "@/lib/api/table.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllTables({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["tables", page, limit, search],
    queryFn: () => tableApi.getAllTableApi({page, limit, search}),  
  });
}
