"use client";

import { menuCategoryApi } from "@/lib/api/menu-category.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllMenuCategories({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["menu-categories", page, limit, search],
    queryFn: () => menuCategoryApi.getAllMenuCategoryApi({page, limit, search}),  
  });
}
