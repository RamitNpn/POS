"use client";
import { menuCategoryApi } from "@/lib/api/menu-category.api";
import { useQuery } from "@tanstack/react-query";

export function useMenuCategoryById(categoryId: string) {
  return useQuery({
    queryKey: ["menu-category", categoryId],
    queryFn: () => menuCategoryApi.getMenuCategoryByIdApi(categoryId),
    enabled: Boolean(categoryId),
  });
}
