"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import {
  statusStyle,
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSupplierSchema,
  TCreateSupplierSchema,
} from "@/lib/validations/supplier.validation";
import { supplierApi } from "@/lib/api/supplier.api";
import { toast } from "@/hooks/use-toast";
import { useAllSuppliers } from "@/hooks/admin/supplier/getAllSupplier";
import { TSupplier } from "@/lib/types/supplier.types";
import { useDeleteSupplier } from "@/hooks/admin/supplier/removeSupplier";
import ConfirmDialog from "@/components/shared/confirmDialog";
import TablePagination from "@/components/shared/pagination";
import { Download, Edit, Eye, Trash2 } from "lucide-react";
import SupplierEditForm from "../editForm/supplier.edit";

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: supplierData } = useAllSuppliers({
    search: search,
  });

  const suppliers = supplierData?.data ?? [];

  const { mutate: deleteSupplier } = useDeleteSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      isActive: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: supplierApi.createSupplierApi,
    onSuccess: () => {
      toast({
        title: "Supplier Created",
        description: "Supplier created successfully.",
      });
      reset();
      setFormVisible(false);
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

  const onSubmit = (data: TCreateSupplierSchema) => {
    mutate(data);
  };

  const filteredSupplier = useMemo(
    () =>
      suppliers.filter((supplier: TSupplier) =>
        [
          supplier.name,
          supplier.email,
          supplier.contactPerson,
          supplier.address,
          supplier.phone,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [suppliers, search],
  );

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteSupplier(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!suppliers?.length) return;

    const headers = [
      "SN",
      "Supplier ID",
      "Name",
      "Contact Person",
      "Phone",
      "Email",
      "Address",
      "Status",
      "Created At",
      "Updated At",
    ];

    const rows = suppliers.map((supplier: TSupplier, index: number) => [
      index + 1,
      supplier._id,
      supplier.name,
      supplier.contactPerson,
      supplier.phone,
      supplier.email,
      supplier.address,
      supplier.isActive ? "Active" : "Inactive",
      formatDate(supplier.createdAt),
      formatDate(supplier.updatedAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `suppliers-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Supplier Directory"
        description="Keep supplier contacts and purchasing partners organized."
      />
      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Supplier
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="New Supplier">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label>Supplier Name</Label>
                <Input {...register("name")} />

                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Contact Person</Label>
                <Input {...register("contactPerson")} />

                {errors.contactPerson && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactPerson.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} />

                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input {...register("email")} type="email" />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <Label>Address</Label>
                <Input {...register("address")} />

                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
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

                {errors.isActive && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="justify-end flex gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setFormVisible(false)}
              >
                Close
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Supplier"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}
      <PageSection title="Suppliers">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <SearchField
              id="reservation-search"
              label="Search reservations"
              value={search}
              onChange={setSearch}
              placeholder="Search by guest, phone or status"
              className="w-full"
            />
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700 mb-1"
              onClick={downloadRecords}
            >
              Export
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AddedAt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupplier.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No supplier found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSupplier.map((supplier: TSupplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(supplier.isActive ? "active" : "cancelled")}`}
                      >
                        {supplier.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {supplier.createdAt
                        ? formatDate(supplier.createdAt)
                        : "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center gap-4">
                        <button className="flex items center text-primary/90 hover:text-primary/80 justify-center p-1 rounded">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditId(supplier._id)}
                          className="flex items center text-green-600 hover:text-green-700 p-1 rounded"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setItemToRemove(supplier._id)}
                          className="flex items center text-red-600 hover:text-red-700 p-1 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {supplierData?.pagination?.totalPages > 1 && (
            <div className="mt-4">
              <TablePagination
                page={page}
                totalPages={supplierData?.pagination?.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </PageSection>

      {editId && (
        <SupplierEditForm supplierId={editId} onClose={() => setEditId(null)} />
      )}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Supplier"
        message="Are you sure you want to remove this supplier?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
