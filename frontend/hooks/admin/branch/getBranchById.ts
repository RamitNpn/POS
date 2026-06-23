"use client";
import { branchApi } from "@/lib/api/branch.api";
import { useQuery } from "@tanstack/react-query";

export function useBranchById(branchId: string) {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => branchApi.getBranchByIdApi(branchId),
    enabled: Boolean(branchId),
  });
}
