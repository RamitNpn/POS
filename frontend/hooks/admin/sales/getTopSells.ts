"use client";

import { salesApi } from "@/lib/api/sales.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllSales({ page = 1, limit, from, to }: UsePaginationParams) {
  return useQuery({
    queryKey: ["sales", page, limit, from, to],
    queryFn: () => salesApi.getAllSalesApi({page, limit, from, to}),  
  });
}
