"use client";

import { orderApi } from "@/lib/api/order.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllOrders({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["orders", page, limit, search],
    queryFn: () => orderApi.getAllOrderApi({page, limit, search}),  
  });
}
