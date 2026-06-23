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
import { useRoomById } from "@/hooks/admin/room/getRoomById";
import { roomApi } from "@/lib/api/room.api";
import { toast } from "@/hooks/use-toast";
import FormHeader from "@/components/shared/formHeader";
import {
  TUpdateRoomSchema,
  updateRoomSchema,
} from "@/lib/validations/room.validation";
import clsx from "clsx";

type Props = {
  roomId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function SectionEditForm({
  roomId,
  onClose,
  size = "lg",
}: Props) {
  const { data: roomData } = useRoomById(roomId);
  const room = roomData?.data || roomData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateRoomSchema>({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: "active",
    },
  });

  useEffect(() => {
    if (!room) return;

    reset({
      name: room.name,
      description: room.description || "",
      isActive: room.isActive || "active",
    });
  }, [
    room?.name,
    room?.description,
    room?.isActive,
  ]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: TUpdateRoomSchema;
    }) => roomApi.updateRoomApi(roomId, data),
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast({
        title: "Section Updated",
        description: "The section was updated successfully.",
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
          "Failed to update section.",
      });
    },
  });

  const onSubmit = (data: TUpdateRoomSchema) => {
    mutate({ roomId, data});
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
          title="Edit Section"
          subtitle="Update section details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Section Details">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-section-name">Section Name</Label>
                <Input
                  id="edit-section-name"
                  {...register("name")}
                  placeholder="e.g. Main Floor"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-section-active">Status</Label>
                <select
                  id="edit-section-active"
                  {...register("isActive")}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.isActive && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-section-description">Description</Label>
                <Input
                  id="edit-section-description"
                  {...register("description")}
                  placeholder="Optional description"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.description.message}
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
            {isPending ? "Updating..." : "Update Section"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
