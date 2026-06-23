"use client";
import { toast } from "@/hooks/use-toast";
import { branchApi } from "@/lib/api/branch.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranchApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchs"] });
      toast({
        title: "Branch Deleted",
        description: "The branch was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete branch.",
      });
    },
  });
}
