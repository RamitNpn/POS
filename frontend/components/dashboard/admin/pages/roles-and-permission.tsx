"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { api } from "@/lib/api/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/shared/confirmDialog";
import {
  createRoleSchema,
  TCreateRoleSchema,
} from "@/lib/validations/role.validation";
import { useDeleteRole } from "@/hooks/admin/role/removeRole";
import { useAllRoles } from "@/hooks/admin/role/getAllRoles";
import { TRole } from "@/lib/types/role.types";
import { Download, Edit, Trash2 } from "lucide-react";
import { roleApi } from "@/lib/api/role.api";
import RoleEditForm from "../editForm/role.edit";

export default function RolesPage() {
  const [filter, setFilter] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: roleData } = useAllRoles({ search: filter });
  const roles = roleData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: "active",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: () => {
      toast({
        title: "Role Created",
        description: "The role was added successfully.",
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
          "Failed to add role.",
      });
    },
  });

  const { mutate: deleteRoom } = useDeleteRole();

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteRoom(itemToRemove, {
      onSuccess: () => setItemToRemove(null),
    });
  };

  const onSubmit = (data: TCreateRoleSchema) => {
    mutate(data);
  };

  const downloadRecords = () => {
    if (!roles?.length) return;

    const headers = [
      "SN",
      "Role ID",
      "Role Name",
      "Description",
      "User Count",
      "Status",
    ];

    const rows = roles.map((section: TRole, index: number) => [
      index + 1,
      section._id,
      section.name,
      section.description,
      section.userCount,
      section.isActive,
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
    link.download = `user-role-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Roles & Permissions"
        description="Review role assignments and permission coverage across your team."
      >
        {/* <Button>New role</Button> */}
      </DashboardHeader>

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Roles
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Create New Role">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="new-role-name">Role name</Label>
                <Input
                  id="new-role-name"
                  {...register("name")}
                  placeholder="e.g. Floor manager"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-role-description">Description</Label>
                <Input
                  id="new-role-description"
                  {...register("description")}
                  placeholder="Describe the role responsibilities"
                />
                {errors.description && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.description.message}
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
                {isPending ? "Adding..." : "Add Role"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Role Overview">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.length === 0 ? (
              <Card className="px-6 py-4 text-center text-gray-500">
                No room found
              </Card>
            ) : (
              roles.map((role: TRole) => (
                <Card key={role._id} className="bg-card border-border">
                  <CardHeader className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditId(role._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToRemove(role._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Users: {role.userCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDate(role.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </PageSection>

      {editId && (
        <RoleEditForm roleId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
