"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { PageSection } from "@/components/dashboard/admin/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMenuItemById } from "@/hooks/admin/menu-item/getMenuItemById";
import { useAllMenuCategories } from "@/hooks/admin/menu-category/getAllMenuCategories";
import { menuItemApi } from "@/lib/api/menu-item.api";
import { toast } from "@/hooks/use-toast";
import FormHeader from "@/components/shared/formHeader";
import {
  TUpdateMenuItemSchema,
  updateMenuItemSchema,
} from "@/lib/validations/menu-item.validation";
import { TMenuCategory } from "@/lib/types/menu-category.types";
import clsx from "clsx";

type Props = {
  menuItemId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function MenuItemEditForm({
  menuItemId,
  onClose,
  size = "lg",
}: Props) {
  const { data: itemData } = useMenuItemById(menuItemId);
  const item = itemData?.data ?? itemData;
  const { data: categoriesData } = useAllMenuCategories({});
  const categories = categoriesData?.data ?? [];
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TUpdateMenuItemSchema>({
    resolver: zodResolver(updateMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      status: "available",
      image: "",
    },
  });

  useEffect(() => {
    if (!item) return;

    reset({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId,
      price: item.price,
      status: item.status,
      image: "",
    });
  }, [item, reset]);

  const queryClient = useQueryClient();

  const selectedImage = watch("image");

  useEffect(() => {
    if (!selectedImage?.length) {
      setImagePreview(null);
      return;
    }

    const file = selectedImage[0];
    const url = URL.createObjectURL(file);

    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      menuItemId,
      formData,
    }: {
      menuItemId: string;
      formData: FormData;
    }) => menuItemApi.updateMenuItemApi(menuItemId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({
        title: "Menu Item Updated",
        description: "The menu item was updated successfully.",
      });
      onClose();
      setImagePreview(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update menu item.",
      });
    },
  });

  const onSubmit = (data: TUpdateMenuItemSchema) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("categoryId", data.categoryId || "");
    formData.append("price", String(data.price || 0));
    formData.append("status", data.status || "available");

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    mutate({ menuItemId, formData });
  };

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
          title="Edit Menu Item"
          subtitle="Update menu item details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Item Details">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="edit-item-name">Item Name</Label>
                <Input
                  id="edit-item-name"
                  {...register("name")}
                  placeholder="e.g. Spaghetti"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-item-category">Category</Label>
                <select
                  id="edit-item-category"
                  {...register("categoryId")}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((category: TMenuCategory) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-item-price">Price</Label>
                <Input
                  id="edit-item-price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-item-status">Status</Label>
                <select
                  id="edit-item-status"
                  {...register("status")}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="available">Available</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="edit-item-description">Description</Label>
                <Input
                  id="edit-item-description"
                  {...register("description")}
                  placeholder="Optional description"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="edit-item-image">Image</Label>
                <Input
                  id="edit-item-image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                />

                <div className="mt-4 flex flex-wrap gap-8">
                  {item?.image && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Current Image
                      </p>

                      <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="rounded-lg border border-primary object-cover"
                      />
                    </div>
                  )}

                  {imagePreview && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        New Image
                      </p>

                      <Image
                        src={imagePreview}
                        alt="New Preview"
                        width={160}
                        height={160}
                        className="rounded-lg border-2 border-destructive object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PageSection>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Item"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
