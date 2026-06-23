"use client";
import { toast } from "@/hooks/use-toast";
import { roleApi } from "@/lib/api/role.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRoleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Role Deleted",
        description: "The role was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete role.",
      });
    },
  });
}
