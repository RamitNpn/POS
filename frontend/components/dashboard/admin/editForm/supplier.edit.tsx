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
import { useEffect } from "react";

import { TUpdateSupplierSchema, updateSupplierSchema } from "@/lib/validations/supplier.validation";
import { supplierApi } from "@/lib/api/supplier.api";
import { useSupplierById } from "@/hooks/admin/supplier/getSupplierById";

type Props = {
  supplierId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function SupplierEditForm({
  supplierId,
  onClose,
  size = "lg",
}: Props) {
  const { data: supplierData } = useSupplierById(supplierId);
  const supplier = supplierData?.data || supplierData;

  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(updateSupplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!supplier) return;

    reset({
      name:supplier.name,
      contactPerson:supplier.contactPerson,
      phone:supplier.phone,
      email:supplier.email,
      address:supplier.address,
      isActive:supplier.isActive ? true : false,
    });
  }, [supplier, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      supplierId,
      data,
    }: {
      supplierId: string;
      data: TUpdateSupplierSchema;
    }) => supplierApi.updateSupplierApi(supplierId, data),
    onSuccess: () => {
      toast({
        title: "Supplier Updated",
        description: "The supplier was updated successfully.",
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
          "Failed to update supplier.",
      });
    },
  });

  const onSubmit = (data: TUpdateSupplierSchema) => {
    mutate({
      supplierId,
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
          title="Edit Role"
          subtitle="Update role details."
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <PageSection title="Update Supplier">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label>Supplier Name</Label>
                <Input {...register("name")} />
              </div>

              <div>
                <Label>Contact Person</Label>
                <Input {...register("contactPerson")} />
              </div>

              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} />
              </div>

              <div>
                <Label>Email</Label>
                <Input {...register("email")} type="email" />
              </div>

              <div className="lg:col-span-2">
                <Label>Address</Label>
                <Input {...register("address")} />
              </div>

              <div className="lg:col-span-2">
                <Label>Status</Label>

                <select
                  {...register("isActive", {
                    setValueAs: (v) => v === "true",
                  })}
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
            {isPending ? "Updating..." : "Update Supplier"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
