import { tableApi } from "@/lib/api/table.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { TableStatus } from "@/lib/types/table.types";

type UpdateTableStatusPayload = {
  tableId: string;
  status: TableStatus;
};

export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tableId, status }: UpdateTableStatusPayload) => {
      const response = await tableApi.updateTableStatusApi(tableId, status);

      if (!response.success) {
        throw new Error(response.error || "Failed to update table status");
      }

      return response.data;
    },

    onSuccess: () => {
      toast({
        title: "Upate Table Status",
        description: `Table set as available`,
      });

      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update table status",
      });
    },
  });
};
