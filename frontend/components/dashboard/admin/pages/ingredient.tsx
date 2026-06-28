"use client";

import { useMemo, useState } from "react";
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
  formatDate,
  PageSection,
  SearchField,
} from "@/components/dashboard/admin/shared";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { Download, Edit, Eye, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { TIngredient } from "@/lib/types/ingredient.types";
import { useAllIngredient } from "@/hooks/admin/ingredient/getAllIngrediets";
import { useDeleteIngredient } from "@/hooks/admin/ingredient/removeIngredient";
import { useMutation } from "@tanstack/react-query";
import { ingredientApi } from "@/lib/api/ingredient.api";
import { toast } from "@/hooks/use-toast";
import {
  createIngredientSchema,
  TCreateIngredientSchema,
} from "@/lib/validations/inventory.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingredientUnits } from "@/data/measuringUnits";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Controller } from "react-hook-form";
import IngredientEditForm from "../editForm/ingredient.edit";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: ingredientData } = useAllIngredient({ search: search });
  const ingredients = ingredientData?.data || [];

  const { mutate: deleteIngredient } = useDeleteIngredient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: undefined,
      currentStock: 0,
      minimumStock: 0,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: ingredientApi.createIngredient,
    onSuccess: () => {
      toast({
        title: "Add Ingredient",
        description: "The ingredient was created successfully.",
      });
      reset();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create ingredient.";

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  const onSubmit = (data: TCreateIngredientSchema) => {
    mutate(data);
  };

  const filteredReservation = useMemo(
    () =>
      ingredients.filter((ingredient: TIngredient) =>
        [
          ingredient.name,
          ingredient.category,
          ingredient.unit,
          ingredient.isActive,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [ingredients, search],
  );

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteIngredient(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  const lowStock = ingredients.filter(
    (item: TIngredient) => item.currentStock <= item.minimumStock,
  ).length;

  const downloadRecords = () => {
    if (!ingredients?.length) return;

    const headers = [
      "SN",
      "Inventory ID",
      "Item Name",
      "Category",
      "Unit",
      "Current Stock",
      "Minimum Stock",
      "Status",
      "Last Stock In Date",
      "Created At",
      "Updated At",
    ];

    const rows = ingredients.map((item: TIngredient, index: number) => [
      index + 1,
      item._id,
      item.name,
      item.category,
      item.unit,
      item.currentStock,
      item.minimumStock,
      item.isActive ? "Active" : "Inactive",
      formatDate(item.lastStockInDate),
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Inventory Overview"
        description="Track ingredient stock levels and reorder thresholds."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Ingredient
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Add Ingredient">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Chicken, Rice..." />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  {...register("category")}
                  placeholder="Meat, Vegetable..."
                />
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Unit</Label>
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full mt-[2px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>

                      <SelectContent>
                        {ingredientUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.unit && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.unit.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Current Stock</Label>
                <Input
                  type="number"
                  {...register("currentStock", { valueAsNumber: true })}
                />
                {errors.currentStock && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currentStock.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Minimum Stock</Label>
                <Input
                  type="number"
                  {...register("minimumStock", { valueAsNumber: true })}
                />
                {errors.currentStock && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.currentStock.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="justify-end flex gap-3 pt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setFormVisible(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Ingredient"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <div className="flex items-end gap-2">
          <SearchField
            id="inventory-search"
            label="Search inventory"
            value={search}
            onChange={setSearch}
            placeholder="Search ingredients..."
            className="w-full"
          />
          <Button
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700 mb-1"
            onClick={downloadRecords}
          >
            Export
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-card rounded-full flex gap-2 items-center border px-4 py-3">
          <span className="text-sm text-muted-foreground">Low stock</span>
          <span className="text-sm font-semibold">{lowStock}</span>
        </div>
      </div>

      <PageSection title="Ingredient Inventory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Minimum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredReservation.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No ingredient found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReservation.map((ingredient: TIngredient) => {
                const isLow = ingredient.currentStock < ingredient.minimumStock;
                return (
                  <TableRow key={ingredient._id}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell>
                      {ingredient.currentStock} {ingredient.unit}
                    </TableCell>
                    <TableCell>{ingredient.minimumStock}</TableCell>
                    <TableCell>
                      {isLow ? (
                        <span className="text-red-500 font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600">OK</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        {/* <button className="flex items center text-primary/90 hover:text-primary/80 justify-center p-1 rounded">
                          <Eye className="h-5 w-5" />
                        </button> */}
                        <button
                          onClick={() => setEditId(ingredient._id)}
                          className="flex items center text-green-600 hover:text-green-700 p-1 rounded"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setItemToRemove(ingredient._id)}
                          className="flex items center text-red-600 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </PageSection>
      {editId && (
        <IngredientEditForm
          ingredientId={editId}
          onClose={() => setEditId(null)}
        />
      )}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Ingredient"
        message="Are you sure you want to remove this ingredient?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
