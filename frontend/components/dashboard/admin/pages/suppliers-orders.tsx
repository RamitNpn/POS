"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import { formatDate, PageSection } from "@/components/dashboard/admin/shared";

import type { PurchaseOrder } from "@/lib/types";
import { api } from "@/lib/api/mock-data";
import { useAllSuppliers } from "@/hooks/admin/supplier/getAllSupplier";
import { TSupplier } from "@/lib/types/supplier.types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { purchaseOrderApi } from "@/lib/api/purchase-order.api";
import {
  createPurchaseSchema,
  TCreatePurchaseOrderSchema,
} from "@/lib/validations/purchase-order.validation";
import { TIngredient } from "@/lib/types/ingredient.types";
import { useAllIngredient } from "@/hooks/admin/ingredient/getAllIngrediets";
import { useAllPurchaseOrder } from "@/hooks/admin/purchase-order/getAllPurchaseOrder";
import { TPurchase } from "@/lib/types/purchase-order.types";

export default function PurchaseOrdersPage() {
  const [showForm, setShowForm] = useState(false);

  const { data: ingredientData } = useAllIngredient({});
  const ingredients = ingredientData?.data || [];

  const { data: purchaseOrder } = useAllPurchaseOrder({});
  const purchases = purchaseOrder?.data || [];

  const { data: supplierData } = useAllSuppliers({});
  const suppliers = supplierData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      supplierId: "",
      invoiceNumber: "",
      purchaseDate: "",
      notes: "",
      items: [
        {
          ingredientId: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);
  }, [items]);

  const { mutate, isPending } = useMutation({
    mutationFn: purchaseOrderApi.createPurchaseOrderApi,
    onSuccess: () => {
      toast({
        title: "Purchase Added",
        description: "Purchase added successfully.",
      });
      reset();
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create supplier.",
      });
    },
  });

  const onSubmit = (data: TCreatePurchaseOrderSchema) => {
    const payload = {
      ...data,
      items: data.items.map((i: any) => ({
        ...i,
        totalPrice: i.quantity * i.unitPrice,
      })),
      totalAmount: subtotal,
    };

    mutate(payload);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Purchase Orders"
        description="Manage supplier purchases and stock intake."
      />

      {!showForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>Create Purchase</Button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Create Purchase Order">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div>
                <Label>Supplier</Label>

                <select
                  id="new-table-section"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("supplierId")}
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((s: TSupplier) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.supplierId.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Invoice Number</Label>
                <Input {...register("invoiceNumber")} placeholder="INV-001" />
              </div>

              <div>
                <Label>Date</Label>
                <Input type="date" {...register("purchaseDate")} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-semibold">Items</h3>

                <Button
                  type="button"
                  onClick={() =>
                    append({
                      ingredientId: "",
                      quantity: 1,
                      unitPrice: 0,
                    })
                  }
                >
                  + Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => {
                    const item = items[index];

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <select
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            {...register(`items.${index}.ingredientId`)}
                          >
                            <option value="">Select Ingredient</option>
                            {ingredients.map((i: TIngredient) => (
                              <option key={i._id} value={i._id}>
                                {i.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            {...register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                          />
                        </TableCell>

                        <TableCell>
                          Rs. {(item?.quantity || 0) * (item?.unitPrice || 0)}
                        </TableCell>

                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="text-right space-y-2">
                <p className="text-lg font-semibold">
                  Subtotal: Rs. {subtotal}
                </p>

                <CardFooter className="justify-end flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowForm(false)}
                  >
                    Close
                  </Button>

                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Purchase"}
                  </Button>
                </CardFooter>
              </div>
            </div>
          </PageSection>
        </form>
      )}

      <PageSection title="Order History">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No Purchase Order found
                </TableCell>
              </TableRow>
            ) : (
              purchases.map((order: TPurchase) => (
                <TableRow key={order._id}>
                  <TableCell>{order.invoiceNumber}</TableCell>
                  <TableCell>{order.supplier?.name}</TableCell>
                  <TableCell>Rs {order.totalAmount}</TableCell>
                  <TableCell>
                    {order.purchaseDate ? formatDate(order.purchaseDate) : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
