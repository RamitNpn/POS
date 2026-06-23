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
  TUpdateBranchSchema,
  updateBranchSchema,
} from "@/lib/validations/branch.validation";
import { branchApi } from "@/lib/api/branch.api";
import { useBranchById } from "@/hooks/admin/branch/getBranchById";

type Props = {
  branchId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function BranchEditForm({
  branchId,
  onClose,
  size = "lg",
}: Props) {
  const { data: branchData } = useBranchById(branchId);
  const branch = branchData?.data || branchData;

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(updateBranchSchema),
    defaultValues: {
      name: "",
      address: "",
      managerName: "",
      phone: "",
      status: "active",
      opened: "",
    },
  });

  useEffect(() => {
    if (!branch) return;

    reset({
      name: branch.name,
      address: branch.address,
      managerName: branch.managerName,
      phone: branch.phone,
      status: branch.status || "active",
      opened: branch.opened,
    });
  }, [branch, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: string;
      data: TUpdateBranchSchema;
    }) => branchApi.updateBranchApi(branchId, data),
    onSuccess: () => {
      toast({
        title: "Branch Updated",
        description: "The branch was updated successfully.",
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
          "Failed to update branch.",
      });
    },
  });

  const onSubmit = (data: TUpdateBranchSchema) => {
    mutate({ branchId, data });
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
          title="Edit branch"
          subtitle="Update branch details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Add Branch">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-branch-name">Branch name</Label>
                <Input
                  id="new-branch-name"
                  {...register("name")}
                  placeholder="Branch name"
                />
              </div>
              <div>
                <Label htmlFor="new-branch-manager">Manager ID</Label>
                <Input
                  id="new-branch-manager"
                  {...register("managerName")}
                  placeholder="Manager name"
                />
              </div>
              <div>
                <Label htmlFor="new-branch-phone">Phone</Label>
                <Input
                  id="new-branch-phone"
                  {...register("phone")}
                  placeholder="Contact phone"
                />
              </div>
              <div>
                <Label htmlFor="new-branch-address">Address</Label>
                <Input
                  id="new-branch-address"
                  {...register("address")}
                  placeholder="Full location address"
                />
              </div>
              <div>
                <Label htmlFor="new-branch-opened">Establishment Date</Label>
                <Input
                  id="new-branch-opened"
                  type="date"
                  {...register("opened")}
                  placeholder="Established time"
                />
              </div>
              <div>
                <Label htmlFor="new-branch-status">Status</Label>
                <select
                  id="new-branch-status"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </PageSection>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Branch"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
