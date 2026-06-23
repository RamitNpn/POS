"use client";

import { orderApi } from "@/lib/api/order.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllOrdersByDate({ dateReport }: UsePaginationParams) {
  return useQuery({
    queryKey: ["orders-by-date", dateReport],
    queryFn: () => orderApi.getOrderByDateApi({ dateReport }),
  });
}
