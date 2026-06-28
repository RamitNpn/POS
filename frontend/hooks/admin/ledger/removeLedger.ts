"use client";
import { toast } from "@/hooks/use-toast";
import { ledgerApi } from "@/lib/api/ledger.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteLedger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ledgerApi.deleteLedgerApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete ledger"] });
      toast({
        title: "Ledger Delete",
        description: "The ledger was deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.log(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete ledger",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete ledger",
      });
    },
  });
}
