"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { PageSection } from "@/components/dashboard/admin/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import FormHeader from "@/components/shared/formHeader";
import clsx from "clsx";
import { useMenuCategoryById } from "@/hooks/admin/menu-category/getMenuCategoryById";
import {
  TUpdateMenuCategorySchema,
  updateMenuCategorySchema,
} from "@/lib/validations/menu-category.validation";
import { menuCategoryApi } from "@/lib/api/menu-category.api";

type Props = {
  categoryId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function MenuCategoryEditForm({
  categoryId,
  onClose,
  size = "lg",
}: Props) {
  const { data: categoryData } = useMenuCategoryById(categoryId);
  const table = categoryData?.data ?? categoryData;

  const { register, handleSubmit, reset } = useForm<TUpdateMenuCategorySchema>({
    resolver: zodResolver(updateMenuCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!table) return;

    reset({
      name: table.name,
      description: table.description,
    });
  }, [table, reset]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: TUpdateMenuCategorySchema;
    }) => menuCategoryApi.updateMenuCategoryApi(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Category Updated",
        description: "The category was updated successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update category.",
      });
    },
  });

  const onSubmit = (data: TUpdateMenuCategorySchema) => {
    mutate({ categoryId, data });
  };

  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        <FormHeader
          title="Edit Munu Category"
          subtitle="Update category details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Update Category">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-category-name">Category name</Label>
                <Input
                  id="new-category-name"
                  {...register("name")}
                  placeholder="e.g. Main Course"
                />
              </div>
              <div>
                <Label htmlFor="new-category-description">Description</Label>
                <Input
                  id="new-category-description"
                  {...register("description")}
                  placeholder="Optional category description"
                />
              </div>
            </div>
          </PageSection>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Category"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
