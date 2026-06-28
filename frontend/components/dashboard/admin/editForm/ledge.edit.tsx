"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import FormHeader from "@/components/shared/formHeader";
import clsx from "clsx";
import {
  TUpdateLedgerSchema,
  updateLedgerSchema,
} from "@/lib/validations/ledger.validation";
import { useLedgerById } from "@/hooks/admin/ledger/getLedgerById";
import { ledgerApi } from "@/lib/api/ledger.api";

type Props = {
  ledgerId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

function LedgerEditForm({ ledgerId, onClose, size = "lg" }: Props) {
  const { data: ledgerData } = useLedgerById(ledgerId);
  const ledger = ledgerData?.data ?? ledgerData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateLedgerSchema>({
    resolver: zodResolver(updateLedgerSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: new Date(),
      type: "credit",
      amount: 0,
      description: "",
      reference: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (!ledger) return;

    const formattedDate = ledger.date
      ? new Date(ledger.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    reset({
      customerName: ledger.customerName ?? "",
      customerPhone: ledger.customerPhone ?? "",
      customerEmail: ledger.customerEmail ?? "",
      date: formattedDate as unknown as Date,
      type: ledger.type ?? "credit",
      amount: ledger.amount ?? 0,
      description: ledger.description ?? "",
      reference: ledger.reference ?? "",
      remarks: ledger.remarks ?? "",
    });
  }, [ledger, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      ledgerId,
      payload,
    }: {
      ledgerId: string;
      payload: TUpdateLedgerSchema;
    }) => ledgerApi.updateLedgerApi(ledgerId, payload),
    onSuccess: () => {
      toast({
        title: "Ledger Updated",
        description: "The ledger record was updated successfully.",
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
          "Failed to update ledger record.",
      });
    },
  });

  const onSubmit = (data: TUpdateLedgerSchema) => {
    const payload = {
      ...data,
      date: new Date(data.date),
      amount: data.amount ? Number(data.amount) : undefined,
    };

    mutate({ ledgerId, payload });
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
          title="Edit Ledger Entry"
          subtitle="Modify statements, track transactional variations or audit trails"
          onClose={onClose}
        />

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Customer Name */}
            <div>
              <Label htmlFor="edit-customerName">Customer Name</Label>
              <Input
                id="edit-customerName"
                {...register("customerName")}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <Label htmlFor="edit-customerPhone">Customer Phone</Label>
              <Input
                id="edit-customerPhone"
                {...register("customerPhone")}
                placeholder="Enter contact details"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.customerPhone.message}
                </p>
              )}
            </div>

            {/* Customer Email */}
            <div>
              <Label htmlFor="edit-customerEmail">Customer Email</Label>
              <Input
                id="edit-customerEmail"
                type="email"
                {...register("customerEmail")}
                placeholder="customer@domain.com"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.customerEmail.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="edit-date">Transaction Date</Label>
              <Input id="edit-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Ledger Type */}
            <div>
              <Label htmlFor="edit-type">Ledger Type</Label>
              <select
                id="edit-type"
                {...register("type")}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="any"
                {...register("amount", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Reference */}
            <div>
              <Label htmlFor="edit-reference">Reference</Label>
              <Input
                id="edit-reference"
                {...register("reference")}
                placeholder="Invoice, receipt or bill numbers"
              />
              {errors.reference && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.reference.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                {...register("description")}
                placeholder="Transaction details..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <Label htmlFor="edit-remarks">Remarks</Label>
              <Input
                id="edit-remarks"
                {...register("remarks")}
                placeholder="Internal audit notes..."
              />
              {errors.remarks && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.remarks.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Entry"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}

export default LedgerEditForm;
