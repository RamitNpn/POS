"use client";

import { toast } from "@/hooks/use-toast";
import { supplierApi } from "@/lib/api/supplier.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplierId: string) =>
      supplierApi.deleteSupplierApi(supplierId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast({
        title: "Supplier Delete",
        description: "The supplier was deleted successfully.",
      });
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete supplier",
      });
    },
  });
}