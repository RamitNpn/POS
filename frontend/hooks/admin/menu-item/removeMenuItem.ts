"use client";
import { toast } from "@/hooks/use-toast";
import { menuItemApi } from "@/lib/api/menu-item.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuItemApi.deleteMenuItemApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({
        title: "Menu Item Deleted",
        description: "The menu item was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete menu item.",
      });
    },
  });
}
