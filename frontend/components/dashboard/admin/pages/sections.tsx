"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageSection,
  SearchField,
  TableBadge,
} from "@/components/dashboard/admin/shared";
import { useAllRooms } from "@/hooks/admin/room/getAllRooms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRoomSchema,
  TCreateRoomSchema,
} from "@/lib/validations/room.validation";
import { useMutation } from "@tanstack/react-query";
import { roomApi } from "@/lib/api/room.api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { TRoom } from "@/lib/types/room.types";
import { Download, Edit, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { useDeleteRoom } from "@/hooks/admin/room/removeRoom";
import SectionEditForm from "@/components/dashboard/admin/editForm/section.edit";

export default function SectionsPage() {
  const [filter, setFilter] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: roomData } = useAllRooms({ search: filter });
  const rooms = roomData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: "active",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: () => {
      toast({
        title: "Room Created",
        description: "The room was added successfully.",
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

  const { mutate: deleteRoom } = useDeleteRoom();

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteRoom(itemToRemove, {
      onSuccess: () => setItemToRemove(null),
    });
  };

  const onSubmit = (data: TCreateRoomSchema) => {
    mutate(data);
  };

  const downloadRecords = () => {
    if (!rooms?.length) return;

    const headers = [
      "SN",
      "Section ID",
      "Section Name",
      "Description",
      "Table Count",
      "Status",
    ];

    const rows = rooms.map((section: TRoom, index: number) => [
      index + 1,
      section._id,
      section.name,
      section.description,
      section.tableCount,
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
    link.download = `table-sections-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Table Sections"
        description="Organize seating sections and monitor section capacity."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Rooms
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Create Section">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="section-name">Section name</Label>
                <Input
                  id="section-name"
                  {...register("name")}
                  placeholder="Enter section name"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="section-active">Status</Label>
                <select
                  id="section-active"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("isActive")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.isActive && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="section-description">Description</Label>
                <Input
                  id="section-description"
                  {...register("description")}
                  placeholder="Brief description"
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
                {isPending ? "Adding..." : "Add Room"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Restaurant Sections">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <SearchField
              id="section-search"
              label="Search sections"
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.length === 0 ? (
              <Card className="px-6 py-4 text-center text-gray-500">
                No room found
              </Card>
            ) : (
              rooms.map((section: TRoom) => (
                <Card key={section._id} className="bg-card border-border">
                  <CardHeader className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{section.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditId(section._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToRemove(section._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {section.description ?? "Standard dining section"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <TableBadge label={`${section.tableCount} tables`} />
                      <TableBadge label={section.isActive} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </PageSection>

      {editId && (
        <SectionEditForm roomId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Delete Section"
        message="Are you sure you want to delete this section?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
