import { ticketApi } from "@/lib/api/ticket.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCancelTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketID: string) => {
      const response =
        await ticketApi.updateticketStatusApi(
          ticketID,
          "served",
        );

      if (!response.success) {
        throw new Error(
          response.error || "Failed to update ticket",
        );
      }

      return response.data;
    },

    onSuccess: () => {
      toast.success("Ticket marked as served");

      queryClient.invalidateQueries({
        queryKey: ["all-tickets"],
      });
    },
  });
};