"use client";

import { useQuery } from "@tanstack/react-query";
import { salesApi } from "@/lib/api/sales.api";
import { UsePaginationParams } from "@/lib/types/usePagination";

export function useTopSellingItems({
  page = 1,
  limit,
  from,
  to,
}: UsePaginationParams) {
  return useQuery({
    queryKey: ["top-selling-items", page, limit, from, to],

    queryFn: () =>
      salesApi.getTopSellingItemsApi({
        page,
        limit,
        from,
        to,
      }),
  });
}
