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
import { useMenuCategoryById } from "@/hooks/admin/menu-category/getMenuCategoryById";
import { menuCategoryApi } from "@/lib/api/menu-category.api";
import { toast } from "@/hooks/use-toast";
import FormHeader from "@/components/shared/formHeader";
import { TUpdateMenuCategorySchema, updateMenuCategorySchema } from "@/lib/validations/menu-category.validation";
import clsx from "clsx";

type Props = {
  categoryId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function MenuCategoryEditForm({ categoryId, onClose, size = "lg" }: Props) {
  const { data: categoryData } = useMenuCategoryById(categoryId);
  const category = categoryData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateMenuCategorySchema>({
    resolver: zodResolver(updateMenuCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!category) return;

    reset({
      name: category.name,
      description: category.description || "",
    });
  }, [category, reset]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ categoryId, formData }: { categoryId: string; formData: FormData }) =>
      menuCategoryApi.updateMenuCategoryApi(categoryId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
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
          error?.response?.data?.error || error?.message ||
          "Failed to update category.",
      });
    },
  });

  const onSubmit = (data: TUpdateMenuCategorySchema) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");

    mutate({ categoryId, formData });
  };

  if (!category) return null;

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
        <FormHeader title="Edit Category" subtitle="Update menu category details." onClose={onClose} />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Category Details">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  {...register("name")}
                  placeholder="e.g. Main Course"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-category-description">Description</Label>
                <Input
                  id="edit-category-description"
                  {...register("description")}
                  placeholder="Optional description"
                />
                {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
              </div>
            </div>
          </PageSection>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
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
