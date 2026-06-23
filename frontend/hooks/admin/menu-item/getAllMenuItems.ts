"use client";

import { menuItemApi } from "@/lib/api/menu-item.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllMenuItems({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["menu-items", page, limit, search],
    queryFn: () => menuItemApi.getAllMenuItemApi({page, limit, search}),  
  });
}
