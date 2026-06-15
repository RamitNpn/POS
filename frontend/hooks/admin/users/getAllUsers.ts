"use client";

import { userApi } from "@/lib/api/user.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers({ page = 1, limit = 10, search, role }: UsePaginationParams) {
  return useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: () => userApi.getAllUserApi({page, limit, search, role}),  
  });
}