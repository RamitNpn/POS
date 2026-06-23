"use client";

import { roleApi } from "@/lib/api/role.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllRoles({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["roles", page, limit, search],
    queryFn: () => roleApi.getAllRoleApi({page, limit, search}),  
  });
}