"use client";
import { toast } from "@/hooks/use-toast";
import { ingredientApi } from "@/lib/api/ingredient.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ingredientApi.deleteIngredientApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete ingredient"] });
      toast({
        title: "Ingredient Delete",
        description: "The ingredient was deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.log(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete ingredient",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete ingredient",
      });
    },
  });
}
