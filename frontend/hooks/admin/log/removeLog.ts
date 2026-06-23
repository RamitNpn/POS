"use client";

import { toast } from "@/hooks/use-toast";
import { activityLogApi } from "@/lib/api/log.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteActivityLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activityLogApi.deleteActivityLogApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["activity-logs"],
      });

      toast({
        title: "Log Delete",
        description: "Activity log deleted successfully.",
      });
    },

    onError: (error: any) => {
      console.log(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete log"
      );

      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete log",
      });
    },
  });
}