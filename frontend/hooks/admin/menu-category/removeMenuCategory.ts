"use client";
import { toast } from "@/hooks/use-toast";
import { menuCategoryApi } from "@/lib/api/menu-category.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuCategoryApi.deleteMenuCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      toast({
        title: "Category Deleted",
        description: "The category was removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || error?.message ||
          "Failed to delete category.",
      });
    },
  });
}
