"use client";

import { orderApi } from "@/lib/api/order.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllOrders({ page = 1, limit, search, status, from, to }: UsePaginationParams) {
  return useQuery({
    queryKey: ["orders", page, limit, search, status, from, to],
    queryFn: () => orderApi.getAllOrderApi({page, limit, search, status, from, to}),  
  });
}
