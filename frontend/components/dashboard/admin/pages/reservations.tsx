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
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReservationSchema,
  TCreateReservationSchema,
} from "@/lib/validations/reservation.validation";
import { reservationApi } from "@/lib/api/reservation.api";
import { toast } from "@/hooks/use-toast";
import { TTable } from "@/lib/types/table.types";
import { useAllTables } from "@/hooks/admin/table/getAllTables";
import { useAllReservation } from "@/hooks/admin/reservation/getAllReservation";
import { TReservation } from "@/lib/types/reservation.types";
import { Download, Edit, Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { useDeleteReservation } from "@/hooks/admin/reservation/removeReservation";
import ReservationEditForm from "../editForm/reservation.edit";

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: reservationData } = useAllReservation({ search: search });
  const reservations = reservationData?.data || [];

  const { data: tableData } = useAllTables({ status: "available" });
  const tables = tableData?.data ?? [];

  const { mutate: deleteReservation } = useDeleteReservation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      date: "",
      time: "",
      partySize: 0,
      tableId: "",
      status: "confirmed",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: reservationApi.createReservationApi,
    onSuccess: () => {
      toast({
        title: "Reservation Created",
        description: "The reservation was created successfully.",
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
          "Failed to create reservation.",
      });
    },
  });

  const onSubmit = (data: TCreateReservationSchema) => {
    mutate(data);
  };

  const filteredReservation = useMemo(
    () =>
      reservations.filter((table: TTable) =>
        [table.name, table.section, table.status]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [reservations, search],
  );

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteReservation(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!reservations?.length) return;

    const headers = [
      "SN",

      "Reservation ID",
      "Customer Name",
      "Customer Phone",
      "Date",
      "Time",
      "Party Size",
      "Status",

      "Table ID",
      "Table Name",
      "Table Capacity",
      "Table Status",

      "Created At",
      "Updated At",
    ];

    const rows = reservations.map(
      (reservation: TReservation, index: number) => [
        index + 1,

        reservation._id,
        reservation.customerName,
        reservation.customerPhone,
        reservation.date,
        reservation.time,
        reservation.partySize,
        reservation.status,

        reservation.table?._id,
        reservation.table?.name,
        reservation.table?.capacity,
        reservation.table?.status,

        formatDate(reservation.createdAt),
        formatDate(reservation.updatedAt),
      ],
    );

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
    link.download = `reservations-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Reservations"
        description="Track upcoming guests, booking details, and table assignments."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Create Reservation
          </Button>
        </div>
      )}
      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="New Reservation">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <Label htmlFor="reservation-name">Guest name</Label>
                <Input
                  {...register("customerName")}
                  id="reservation-name"
                  placeholder="Guest name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reservation-phone">Phone</Label>
                <Input
                  {...register("customerPhone")}
                  id="reservation-phone"
                  placeholder="Contact phone"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reservation-date">Date</Label>
                <Input
                  {...register("date")}
                  id="reservation-date"
                  type="date"
                />
                {errors.date && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reservation-time">Time</Label>
                <Input
                  {...register("time")}
                  id="reservation-time"
                  type="time"
                />
                {errors.time && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reservation-party-size">Party size</Label>
                <Input
                  {...register("partySize", {
                    valueAsNumber: true,
                  })}
                  id="reservation-party-size"
                  type="number"
                />

                {errors.partySize && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.partySize.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-table-section">Table</Label>
                <select
                  id="new-table-section"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("tableId")}
                >
                  <option value="">-- Choose Table --</option>
                  {tables.map((room: TTable) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.tableId && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.tableId.message}
                  </p>
                )}
              </div>
              <div className="lg:col-span-3">
                <Label htmlFor="reservation-status">Status</Label>
                <select
                  id="reservation-status"
                  {...register("status")}
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
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
                {isPending ? "Creating..." : "Create Reservation"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <PageSection title="Reservation Schedule">
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
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservation.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No reservation found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservation.map((reservation: TReservation) => (
                  <TableRow key={reservation._id}>
                    <TableCell>{reservation.customerName}</TableCell>
                    <TableCell>{reservation.customerPhone}</TableCell>
                    <TableCell>{`${formatDate(reservation.date)} ${reservation.time}`}</TableCell>
                    <TableCell>{reservation.partySize}</TableCell>
                    <TableCell>{reservation.table?.name ?? "TBD"}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <button className="flex items center text-primary/90 hover:text-primary/80 justify-center p-1 rounded">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditId(reservation._id)}
                          className="flex items center text-green-600 hover:text-green-700 p-1 rounded"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setItemToRemove(reservation._id)}
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
        </div>
        {editId && (
          <ReservationEditForm
            reservationId={editId}
            onClose={() => setEditId(null)}
          />
        )}
        <ConfirmDialog
          open={itemToRemove !== null}
          title="Remove Reservation"
          message="Are you sure you want to remove this reservation?"
          onConfirm={confirmDelete}
          onCancel={() => setItemToRemove(null)}
        />
      </PageSection>
    </div>
  );
}
