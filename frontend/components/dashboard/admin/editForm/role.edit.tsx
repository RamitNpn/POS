"use client";

import { useEffect } from "react";
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
import {
  TUpdateRoleSchema,
  updateRoleSchema,
} from "@/lib/validations/role.validation";
import { roleApi } from "@/lib/api/role.api";
import { useRoleById } from "@/hooks/admin/role/getRoleById";

type Props = {
  roleId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function RoleEditForm({ roleId, onClose, size = "lg" }: Props) {
  const { data: roleData } = useRoleById(roleId);
  const roles = roleData?.data ?? roleData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: "active",
    },
  });

  useEffect(() => {
    if (!roles) return;

    reset({
      name: roles.name,
      description: roles.description || "",
      isActive: roles.isActive || "active",
    });
  }, [roles?.name, roles?.description, roles?.isActive]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: string;
      data: TUpdateRoleSchema;
    }) => roleApi.updateRoleApi(roleId, data),
    onSuccess: () => {
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

  const onSubmit = (data: TUpdateRoleSchema) => {
    mutate({ roleId, data });
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
          title="Edit Role"
          subtitle="Update role details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Create New Role">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-role-name">Role name</Label>
                <Input
                  id="new-role-name"
                  {...register("name")}
                  placeholder="e.g. Floor manager"
                />
              </div>
              <div>
                <Label htmlFor="new-role-description">Description</Label>
                <Input
                  id="new-role-description"
                  {...register("description")}
                  placeholder="Describe the role responsibilities"
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
            {isPending ? "Updating..." : "Update Role"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
