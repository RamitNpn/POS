import { orderApi } from "@/lib/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      paymentStatus,
      paymentMethod,
      discount,
    }: {
      orderId: string;
      status: string;
      paymentStatus: string;
      paymentMethod: string;
      discount: number;
    }) => {
      const response = await orderApi.updatePaymentStatusApi(orderId, {
        status,
        paymentStatus,
        paymentMethod,
        discount,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to update payment");
      }

      return response.data;
    },

    onSuccess: () => {
      toast({
        title: "Payment Updated",
        description: "Payment updated successfully.",
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
          "Failed to update payment.",
      });
    },
  });
};
