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
  CardFooter,
} from "@/components/ui/card";
import {
  statusStyle,
  PageSection,
  SearchField,
  TableBadge,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Download, Edit, Trash2 } from "lucide-react";
import { useAllbranches } from "@/hooks/admin/branch/getAllBranches";
import { TBranch } from "@/lib/types/branch.types";
import {
  createBranchSchema,
  TCreateBranchSchema,
} from "@/lib/validations/branch.validation";
import { branchApi } from "@/lib/api/branch.api";
import { useDeleteBranch } from "@/hooks/admin/branch/removeBranch";
import ConfirmDialog from "@/components/shared/confirmDialog";
import BranchEditForm from "../editForm/branch.edit";

export default function BranchesPage() {
  const [filter, setFilter] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: branchData } = useAllbranches({ search: filter });
  const branches = branchData?.data ?? [];

  const filtered = useMemo(
    () =>
      branches.filter((branch: TBranch) =>
        [branch.name, branch.address, branch.managerName, branch.phone]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [branches, filter],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: "",
      address: "",
      managerName: "",
      phone: "",
      status: "active",
      opened: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: branchApi.createBranch,
    onSuccess: () => {
      toast({
        title: "Branch Created",
        description: "The branch was added successfully.",
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
          "Failed to add user.",
      });
    },
  });

  const { mutate: deleteRoom } = useDeleteBranch();

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteRoom(itemToRemove, {
      onSuccess: () => setItemToRemove(null),
    });
  };

  const onSubmit = (data: TCreateBranchSchema) => {
    mutate(data);
  };

  const downloadRecords = () => {
    if (!branches?.length) return;

    const headers = [
      "SN",
      "Branch ID",
      "Name",
      "Address",
      "Manager Name",
      "Phone",
      "Status",
      "opened",
    ];

    const rows = branches.map((branch: TBranch, index: number) => [
      index + 1,
      branch._id,
      branch.name,
      branch.address,
      branch.managerName,
      branch.phone,
      branch.status,
      formatDate(branch.opened),
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
    link.download = `branch-record-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Branch Management"
        description="Add, update, and monitor venue locations."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Branch
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Add Branch">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-branch-name">Branch name</Label>
                <Input
                  id="new-branch-name"
                  {...register("name")}
                  placeholder="Branch name"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-branch-manager">Manager ID</Label>
                <Input
                  id="new-branch-manager"
                  {...register("managerName")}
                  placeholder="Manager name"
                />
                {errors.managerName && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.managerName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-branch-phone">Phone</Label>
                <Input
                  id="new-branch-phone"
                  {...register("phone")}
                  placeholder="Contact phone"
                />
                {errors.phone && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-branch-address">Address</Label>
                <Input
                  id="new-branch-address"
                  {...register("address")}
                  placeholder="Full location address"
                />
                {errors.address && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-branch-opened">Establishment Date</Label>
                <Input
                  id="new-branch-opened"
                  type="date"
                  {...register("opened")}
                  placeholder="Established time"
                />
                {errors.opened && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.opened.message}
                  </p>
                )}
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
                {errors.status && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="justify-end flex gap-3 pt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setFormVisible(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Branch"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Branch Locations">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <SearchField
              id="role-search"
              label="Search roles"
              value={filter}
              onChange={setFilter}
              placeholder="Search by name or description"
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
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No branches found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((branch: TBranch) => (
                  <TableRow key={branch._id}>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.address}</TableCell>
                    <TableCell>{branch.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(branch.status ? "active" : "cancelled")}`}
                      >
                        {branch.status ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{branch.managerName ?? "Unassigned"}</TableCell>
                    <TableCell>{formatDate(branch.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditId(branch._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToRemove(branch._id)}
                          className="text-red-600 hover:text-red-700"
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
        </div>
      </PageSection>

      {editId && (
        <BranchEditForm branchId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Branch"
        message="Are you sure you want to remove this branch?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
