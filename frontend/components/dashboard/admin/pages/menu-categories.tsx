"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageSection,
  SearchField,
  TableBadge,
} from "@/components/dashboard/admin/shared";
import { useAllMenuCategories } from "@/hooks/admin/menu-category/getAllMenuCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMenuCategorySchema,
  TCreateMenuCategorySchema,
} from "@/lib/validations/menu-category.validation";
import { menuCategoryApi } from "@/lib/api/menu-category.api";
import { toast } from "@/hooks/use-toast";
import { TMenuCategory } from "@/lib/types/menu-category.types";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { useDeleteMenuCategory } from "@/hooks/admin/menu-category/removeMenuCategory";
import MenuCategoryEditForm from "@/components/dashboard/admin/editForm/menu-category.edit";

export default function MenuCategoriesPage() {
  const [filter, setFilter] = useState("");
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: categoryData } = useAllMenuCategories({ search: filter });
  const categories = categoryData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createMenuCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: menuCategoryApi.createMenuCategory,
    onSuccess: () => {
      toast({
        title: "Category Created",
        description: "The menu category was added successfully.",
      });
      reset();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category.",
      });
    },
  });

  const { mutate: deleteCategory } = useDeleteMenuCategory();

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteCategory(itemToRemove, {
      onSuccess: () => setItemToRemove(null),
    });
  };

  const onSubmit = (data: TCreateMenuCategorySchema) => {
    mutate(data);
  };

  const filtered = useMemo(
    () =>
      categories.filter((category: TMenuCategory) =>
        [category.name, category.description || ""]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [categories, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Menu Categories"
        description="Manage category structure for the ordering menu."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <PageSection title="Add Category">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="new-category-name">Category name</Label>
              <Input
                id="new-category-name"
                {...register("name")}
                placeholder="e.g. Main Course"
              />
              {errors.name && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="new-category-description">Description</Label>
              <Input
                id="new-category-description"
                {...register("description")}
                placeholder="Optional category description"
              />
              {errors.description && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <CardFooter className="justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create category"}
            </Button>
          </CardFooter>
        </PageSection>
      </form>

      <PageSection title="Category Catalog">
        <div className="space-y-4">
          <SearchField
            id="category-search"
            label="Search categories"
            value={filter}
            onChange={setFilter}
            placeholder="Search by name or description"
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((category: TMenuCategory) => (
              <Card key={category._id} className="bg-card border-border">
                <CardHeader className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {category.description ?? "No description available"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditId(category._id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToRemove(category._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <p>{category.itemCount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      {editId && (
        <MenuCategoryEditForm categoryId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
