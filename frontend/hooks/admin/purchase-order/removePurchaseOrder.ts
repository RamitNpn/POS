"use client";
import { toast } from "@/hooks/use-toast";
import { purchaseOrderApi } from "@/lib/api/purchase-order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletepurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseOrderApi.deletePurchaseOrderApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete purchaseOrder"] });
      toast({
        title: "Purchase Order Create",
        description: "The purchase order was deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.log(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete purchase order",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete purchase order",
      });
    },
  });
}
