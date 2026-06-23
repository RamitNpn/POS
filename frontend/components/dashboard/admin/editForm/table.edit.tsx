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
import { useTableById } from "@/hooks/admin/table/getTableById";
import { useAllRooms } from "@/hooks/admin/room/getAllRooms";
import { tableApi } from "@/lib/api/table.api";
import { toast } from "@/hooks/use-toast";
import FormHeader from "@/components/shared/formHeader";
import {
  TUpdateTableSchema,
  updateTableSchema,
} from "@/lib/validations/table.validation";
import { TRoom } from "@/lib/types/room.types";
import clsx from "clsx";

type Props = {
  tableId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function TableEditForm({
  tableId,
  onClose,
  size = "lg",
}: Props) {
  const { data: tableData } = useTableById(tableId);
  const table = tableData?.data ?? tableData;
  const { data: roomData } = useAllRooms({});
  const rooms = roomData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateTableSchema>({
    resolver: zodResolver(updateTableSchema),
    defaultValues: {
      name: "",
      sectionId: "",
      capacity: 1,
      status: "available",
    },
  });

  useEffect(() => {
    if (!table) return;

    reset({
      name: table.name,
      sectionId: table.sectionId || table.section,
      capacity: table.capacity,
      status: table.status,
    });
  }, [table, reset]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      tableId,
      formData,
    }: {
      tableId: string;
      formData: FormData;
    }) => tableApi.updateTableApi(tableId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Table Updated",
        description: "The table was updated successfully.",
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
          "Failed to update table.",
      });
    },
  });

  const onSubmit = (data: TUpdateTableSchema) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("sectionId", data.sectionId || "");
    formData.append("capacity", String(data.capacity || 1));
    formData.append("status", data.status || "available");

    mutate({ tableId, formData });
  };

  if (!table) return null;

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
          title="Edit Table"
          subtitle="Update seating details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Table Details">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-table-name">Table Name</Label>
                <Input
                  id="edit-table-name"
                  {...register("name")}
                  placeholder="e.g. Table 1"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-table-section">Room</Label>
                <select
                  id="edit-table-section"
                  {...register("sectionId")}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select room</option>
                  {rooms.map((room: TRoom) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.sectionId && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.sectionId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-table-capacity">Capacity</Label>
                <Input
                  id="edit-table-capacity"
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.capacity.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-table-status">Status</Label>
                <select
                  id="edit-table-status"
                  {...register("status")}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.status.message}
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
            {isPending ? "Updating..." : "Update Table"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
