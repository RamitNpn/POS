"use client";

import { menuSubCategoryApi } from "@/lib/api/menu-subcategory.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllMenuSubCategories({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["menu-subcategories", page, limit, search],
    queryFn: () => menuSubCategoryApi.getAllMenuSubCategoryApi({page, limit, search}),  
  });
}
