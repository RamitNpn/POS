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
import { CardFooter } from "@/components/ui/card";
import {
  statusStyle,
  PageSection,
  SearchField,
} from "@/components/dashboard/admin/shared";
import { useAllTables } from "@/hooks/admin/table/getAllTables";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTableSchema,
  TCreateTableSchema,
} from "@/lib/validations/table.validation";
import { tableApi } from "@/lib/api/table.api";
import { toast } from "@/hooks/use-toast";
import { TTable } from "@/lib/types/table.types";
import { useAllRooms } from "@/hooks/admin/room/getAllRooms";
import { TRoom } from "@/lib/types/room.types";
import { Download, Edit, Trash2 } from "lucide-react";
import { useDeleteTable } from "@/hooks/admin/table/removeTable";
import ConfirmDialog from "@/components/shared/confirmDialog";
import TableEditForm from "@/components/dashboard/admin/editForm/table.edit";

export default function TablesPage() {
  const [filter, setFilter] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: roomData } = useAllRooms({});
  const rooms = roomData?.data ?? [];

  const { data: tableData } = useAllTables({ search: filter });
  const tables = tableData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      name: "",
      sectionId: "",
      capacity: 2,
      status: undefined,
    },
  });

  const { mutate: deleteTable } = useDeleteTable();

  const { mutate, isPending } = useMutation({
    mutationFn: tableApi.createTable,
    onSuccess: () => {
      toast({
        title: "Table Created",
        description: "The table was added successfully.",
      });
      reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add table.",
      });
    },
  });

  const onSubmit = (data: TCreateTableSchema) => {
    mutate(data);
  };

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteTable(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  const filtered = useMemo(
    () =>
      tables.filter((table: TTable) =>
        [table.name, table.section, table.status]
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [tables, filter],
  );

  const downloadRecords = () => {
    if (!tables?.length) return;

    const headers = [
      "SN",
      "Table ID",
      "Table Name",
      "Capacity",
      "Status",
      "Section",
      "Section ID",
    ];

    const rows = tables.map((table: TTable, index: number) => [
      index + 1,
      table._id,
      table.name,
      table.capacity,
      table.status,
      table.section,
      table.sectionId,
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
    link.download = `tables-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Table Floorplan"
        description="Monitor seating availability and layout status."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add Table
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Add Table">
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <Label htmlFor="new-table-name">Table name</Label>
                <Input
                  id="new-table-name"
                  {...register("name")}
                  placeholder="e.g. Table 1"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-table-section">Section</Label>
                <select
                  id="new-table-section"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("sectionId")}
                >
                  <option value="">-- Choose Rooms --</option>
                  {rooms.map((room: TRoom) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.sectionId && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.sectionId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-table-capacity">Capacity</Label>
                <Input
                  id="new-table-capacity"
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.capacity.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-table-status">Status</Label>
                <select
                  id="new-table-status"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("status")}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
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
                {isPending ? "Adding..." : "Add table"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Table List">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <SearchField
              id="table-search"
              label="Search tables"
              value={filter}
              onChange={setFilter}
              placeholder="Search by name, section or status"
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
                <TableHead>Table</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No tables found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((table: TTable) => (
                  <TableRow key={table._id}>
                    <TableCell>{table.name}</TableCell>
                    <TableCell>{table.section}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(table.status)}`}
                      >
                        {table.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setEditId(table._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToRemove(table._id)}
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
        <TableEditForm tableId={editId} onClose={() => setEditId(null)} />
      )}

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        title="Delete Table"
        message="Are you sure you want to delete this table?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
