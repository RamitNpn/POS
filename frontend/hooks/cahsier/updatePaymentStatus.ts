import { orderApi } from "@/lib/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderID: string) => {
      const response = await orderApi.updatePaymentStatusApi(
        orderID,
        "completed",
        "paid",
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to update payment");
      }

      return response.data;
    },

    onSuccess: () => {
      toast({
        title: "Update Payment Status",
        description: `Payment marked as paid`,
      });

      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to mark payment.",
      });
    },
  });
};
