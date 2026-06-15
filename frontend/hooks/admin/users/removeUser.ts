"use client";
import { toast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUserApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete user"] });
      toast({
        title: "User Created",
        description: "The user was deleted successfully.",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete user";
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete user",
      });
    },
  });
}
