"use client";

import { useMutation } from "@tanstack/react-query";
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
import { useEffect, useState } from "react";
import { ingredientApi } from "@/lib/api/ingredient.api";
import {
  TUpdateIngredientSchema,
  updateIngredientSchema,
} from "@/lib/validations/inventory.validation";
import { ingredientUnits } from "@/data/measuringUnits";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Controller } from "react-hook-form";
import { useIngredientById } from "@/hooks/admin/ingredient/getIngredientById";

type Props = {
  ingredientId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function IngredientEditForm({
  ingredientId,
  onClose,
  size = "lg",
}: Props) {
  const { data: ingredientData } = useIngredientById(ingredientId);
  const ingredients = ingredientData?.data || ingredientData;

  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(updateIngredientSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: undefined,
      currentStock: 0,
      minimumStock: 0,
    },
  });

  useEffect(() => {
    if (!ingredients) return;

    reset({
      name: ingredients.name,
      category: ingredients.category,
      unit: ingredients.unit,
      currentStock: ingredients.currentStock,
      minimumStock: ingredients.minimumStock,
    });
  }, [ingredients, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      ingredientId,
      data,
    }: {
      ingredientId: string;
      data: TUpdateIngredientSchema;
    }) => ingredientApi.updateIngredientApi(ingredientId, data),
    onSuccess: () => {
      toast({
        title: "ingredient Updated",
        description: "The ingredient was updated successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update ingredient.",
      });
    },
  });

  const onSubmit = (data: TUpdateIngredientSchema) => {
    mutate({
      ingredientId,
      data,
    });
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
          title="Edit ingredient"
          subtitle="Update ingredient details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Update Ingredient">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Chicken, Rice..." />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  {...register("category")}
                  placeholder="Meat, Vegetable..."
                />
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
              </div>

              <div>
                <Label>Current Stock</Label>
                <Input
                  type="number"
                  {...register("currentStock", { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label>Minimum Stock</Label>
                <Input
                  type="number"
                  {...register("minimumStock", { valueAsNumber: true })}
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
            {isPending ? "Updating..." : "Update Ingredient"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
