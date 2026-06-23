"use client";
import { toast } from "@/hooks/use-toast";
import { roomApi } from "@/lib/api/room.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.deleteRoomApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast({
        title: "Room Delete",
        description: "The room was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete room.",
      });
    },
  });
}
