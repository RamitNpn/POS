"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardFooter } from "@/components/ui/card";
import {
  statusStyle,
  PageSection,
  SearchField,
} from "@/components/dashboard/admin/shared";
import { useAllMenuItems } from "@/hooks/admin/menu-item/getAllMenuItems";
import { useAllMenuCategories } from "@/hooks/admin/menu-category/getAllMenuCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMenuItemSchema,
  TCreateMenuItemSchema,
} from "@/lib/validations/menu-item.validation";
import { menuItemApi } from "@/lib/api/menu-item.api";
import { toast } from "@/hooks/use-toast";
import { TMenuItem } from "@/lib/types/menu-item.types";
import { TMenuCategory } from "@/lib/types/menu-category.types";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { useDeleteMenuItem } from "@/hooks/admin/menu-item/removeMenuItem";
import MenuItemEditForm from "@/components/dashboard/admin/editForm/menu-item.edit";

export default function MenuItemsPage() {
  const [filter, setFilter] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: categoryData } = useAllMenuCategories({});
  const categories = categoryData?.data ?? [];

  const { data: itemData } = useAllMenuItems({ search: filter });
  const items = itemData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      // preparationTime: 0,
      status: "available",
      image: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: menuItemApi.createMenuItem,
    onSuccess: () => {
      toast({
        title: "Menu Item Created",
        description: "The menu item was added successfully.",
      });
      reset();
      setFormVisible(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add menu item.",
      });
    },
  });

  const { mutate: deleteMenuItem } = useDeleteMenuItem();

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteMenuItem(itemToRemove, {
      onSuccess: () => setItemToRemove(null),
    });
  };

  const onSubmit = (data: TCreateMenuItemSchema) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("categoryId", data.categoryId);
    formData.append("price", String(data.price));
    formData.append("status", data.status);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    mutate(formData as any);
  };

  const categoryMap = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category: TMenuCategory) => [
          category._id,
          category.name,
        ]),
      ),
    [categories],
  );

  const filtered = useMemo(
    () =>
      items.filter((item: TMenuItem) =>
        [
          item.name,
          item.description || "",
          categoryMap[item.categoryId] || "",
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [items, filter, categoryMap],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Food Items"
        description="Review menu items, availability, and pricing."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Items
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Add Menu Item">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-item-name">Item name</Label>
                <Input
                  id="new-item-name"
                  {...register("name")}
                  placeholder="Name of the item"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-item-category">Category</Label>
                <select
                  id="new-item-category"
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("categoryId")}
                >
                  <option value="">Select category</option>
                  {categories.map((category: TMenuCategory) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-item-price">Price</Label>
                <Input
                  id="new-item-price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              {/* <div>
              <Label htmlFor="new-item-prep-time">Prep time (minutes)</Label>
              <Input
                id="new-item-prep-time"
                type="number"
                {...register("preparationTime", { valueAsNumber: true })}
              />
              {errors.preparationTime && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.preparationTime.message}
                </p>
              )}
            </div> */}
              <div className="lg:col-span-2">
                <Label htmlFor="new-item-description">Description</Label>
                <Input
                  id="new-item-description"
                  {...register("description")}
                  placeholder="Optional item description"
                />
                {errors.description && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="new-item-status">Status</Label>
                <select
                  id="new-item-status"
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("status")}
                >
                  <option value="available">Available</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-image">Image</Label>
                <Input id="new-user-image" type="file" {...register("image")} />
              </div>
            </div>
            <CardFooter className="justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add item"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Menu Items">
        <div className="space-y-4">
          <SearchField
            id="food-search"
            label="Search food items"
            value={filter}
            onChange={setFilter}
            placeholder="Search by name, category or status"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
                {/* <TableHead>Prep Time</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item: TMenuItem) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Image
                      height={0}
                      width={120}
                      src={item.image || "itemimage.png"}
                      alt={item.image || item.name}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {categoryMap[item.categoryId] ?? "Unknown"}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditId(item._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToRemove(item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                  {/* <TableCell>{item.preparationTime ? `${item.preparationTime} min` : "N/A"}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>

      {editId && (
        <MenuItemEditForm menuItemId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
