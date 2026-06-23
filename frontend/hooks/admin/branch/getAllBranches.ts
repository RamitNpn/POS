"use client";

import { branchApi } from "@/lib/api/branch.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllbranches({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["branches", page, limit, search],
    queryFn: () => branchApi.getAllBranchApi({page, limit, search}),  
  });
}