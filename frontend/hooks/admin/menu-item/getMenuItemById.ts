"use client";
import { menuItemApi } from "@/lib/api/menu-item.api";
import { useQuery } from "@tanstack/react-query";

export function useMenuItemById(menuItemId: string) {
  return useQuery({
    queryKey: ["menu-item", menuItemId],
    queryFn: () => menuItemApi.getMenuItemByIdApi(menuItemId),
    enabled: Boolean(menuItemId),
  });
}
