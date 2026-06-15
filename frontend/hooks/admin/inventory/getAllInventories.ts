"use client";

import { inventoryApi } from "@/lib/api/inventory.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllInventories({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["inventories", page, limit, search],
    queryFn: () => inventoryApi.getAllInventoryApi({page, limit, search}),  
  });
}
