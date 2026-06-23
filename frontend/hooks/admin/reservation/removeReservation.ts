"use client";
import { toast } from "@/hooks/use-toast";
import { reservationApi } from "@/lib/api/reservation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationApi.deleteReservationApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete reservation"] });
      toast({
        title: "Reservation Delete",
        description: "The reservation was deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.log(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete reservation",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete reservation",
      });
    },
  });
}
