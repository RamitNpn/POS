"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import clsx from "clsx";

import FormHeader from "@/components/shared/formHeader";
import { PageSection } from "@/components/dashboard/admin/shared";
import { toast } from "@/hooks/use-toast";

import {
  TUpdateReservationSchema,
  updateReservationSchema,
} from "@/lib/validations/reservation.validation";

import { reservationApi } from "@/lib/api/reservation.api";
import { useReservationById } from "@/hooks/admin/reservation/getReservationById";
import { TTable } from "@/lib/types/table.types";
import { useAllTables } from "@/hooks/admin/table/getAllTables";

type Props = {
  reservationId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function ReservationEditForm({
  reservationId,
  onClose,
  size = "lg",
}: Props) {
  const { data: reservationData } = useReservationById(reservationId);
  const reservation = reservationData?.data ?? reservationData;

  const { data: tableData } = useAllTables({ status: "available" });
  const tables = tableData?.data ?? [];

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateReservationSchema>({
    resolver: zodResolver(updateReservationSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      date: "",
      time: "",
      partySize: 1,
      status: "confirmed",
      tableId: "",
    },
  });

  useEffect(() => {
    if (!reservation) return;

    reset({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize,
      status: reservation.status,
      tableId: reservation.table?._id || "",
    });
  }, [reservation, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: TUpdateReservationSchema;
    }) => reservationApi.updateReservationApi(reservationId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });

      toast({
        title: "Reservation Updated",
        description: "Reservation updated successfully.",
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
          "Failed to update reservation.",
      });
    },
  });

  const onSubmit = (data: TUpdateReservationSchema) => {
    mutate({ reservationId, data });
  };

  if (!reservation) return null;

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
          title="Edit Reservation"
          subtitle="Update guest booking details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Reservation Details">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Guest Name</Label>
                <Input {...register("customerName")} />
              </div>

              <div>
                <Label>Phone</Label>
                <Input {...register("customerPhone")} />
              </div>

              <div>
                <Label>Date</Label>
                <Input type="date" {...register("date")} />
              </div>

              <div>
                <Label>Time</Label>
                <Input type="time" {...register("time")} />
              </div>

              <div>
                <Label>Party Size</Label>
                <Input
                  type="number"
                  {...register("partySize", {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div>
                <Label>Status</Label>
                <select
                  {...register("status")}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <Label htmlFor="new-table-section">Table</Label>
                <select
                  id="new-table-section"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("tableId")}
                >
                  <option value="">-- Choose Table --</option>
                  {tables.map((room: TTable) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.tableId && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.tableId.message}
                  </p>
                )}
              </div>
            </div>
          </PageSection>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Reservation"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
