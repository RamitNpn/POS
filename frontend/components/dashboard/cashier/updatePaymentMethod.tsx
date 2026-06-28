"use client";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormHeader from "@/components/shared/formHeader";
import { useUpdatePaymentStatus } from "@/hooks/cahsier/updatePaymentStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  orderId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

type PaymentForm = {
  paymentMethod: "cash" | "online" | "credit";
  paymentStatus: "paid" | "unpaid";
  status: "completed" | "pending";
  discount: number;
};

export default function PaymentUpdateForm({
  orderId,
  onClose,
  size = "md",
}: Props) {
  const { mutate, isPending } = useUpdatePaymentStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentForm>({
    defaultValues: {
      paymentMethod: "cash",
      paymentStatus: "paid",
      status: "completed",
      discount: 0,
    },
  });

  const onSubmit = (data: PaymentForm) => {
    mutate(
      {
        orderId,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        status: data.status,
        discount: Number(data.discount),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "w-full rounded-lg border border-border bg-card shadow-2xl overflow-hidden",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        <FormHeader
          title="Update Payment"
          subtitle="Update payment information."
          onClose={onClose}
        />

        <div className="p-6 grid gap-5 md:grid-cols-2">
          <div>
            <Label>Payment Method</Label>

            <select
              {...register("paymentMethod")}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select {...register("paymentStatus")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Order Status</Label>
            <Input
              id="status"
              value="completed"
              disabled
              {...register("status")}
            />
          </div>

          <div>
            <Label>Discount (%)</Label>

            <Input
              type="number"
              min={0}
              max={10}
              step={1}
              {...register("discount", {
                valueAsNumber: true,
              })}
            />

            {errors.discount && (
              <p className="mt-1 text-xs text-destructive">
                {errors.discount.message}
              </p>
            )}
          </div>
        </div>

        <CardFooter className="justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Payment"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
