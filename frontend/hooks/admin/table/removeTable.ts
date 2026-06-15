"use client";
import { toast } from "@/hooks/use-toast";
import { tableApi } from "@/lib/api/table.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tableApi.deleteTableApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Table Deleted",
        description: "The table was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete table.",
      });
    },
  });
}
