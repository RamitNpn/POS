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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CardFooter } from "@/components/ui/card";
import {
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Download, Edit, Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import TablePagination from "@/components/shared/pagination";
import {
  createLedgerSchema,
  TCreateLedgerSchema,
} from "@/lib/validations/ledger.validation";
import { ledgerApi } from "@/lib/api/ledger.api";
import { useAllLedgers } from "@/hooks/admin/ledger/getAllLedgers";
import { useDeleteLedger } from "@/hooks/admin/ledger/removeLedger";
import LedgerEditForm from "../editForm/ledge.edit";

export default function LedgersPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] =useState<string>();
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: ledgerData } = useAllLedgers({
    type: selectedType,
    page,
    search: filter,
  });
  const ledgers = ledgerData?.data ?? [];

  const { mutate: deleteLedger } = useDeleteLedger();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateLedgerSchema>({
    resolver: zodResolver(createLedgerSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: undefined,
      type: "credit",
      amount: 0,
      description: "",
      reference: "",
      remarks: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ledgerApi.createLedger,
    onSuccess: () => {
      toast({
        title: "Ledger Entry Created",
        description: "The ledger record was added successfully.",
      });
      reset();
      setFormVisible(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Unable to add ledger entry",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add ledger entry.",
      });
    },
  });

  const onSubmit = (data: TCreateLedgerSchema) => {
    const payload = {
      ...data,
      date: new Date(data.date),
      amount: Number(data.amount),
    };
    mutate(payload);
  };

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteLedger(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
        toast({
          title: "Success",
          description: "Record removed successfully.",
        });
      },
    });
  };

  const downloadRecords = () => {
    if (!ledgers?.length) return;

    const headers = [
      "SN",
      "Ledger ID",
      "Voucher No",
      "Customer Name",
      "Phone",
      "Email",
      "Date",
      "Type",
      "Amount",
      "Reference",
      "Created At",
    ];

    const rows = ledgers.map((ledger: any, index: number) => [
      index + 1,
      ledger._id,
      ledger.voucherNo || "N/A",
      ledger.customerName,
      ledger.customerPhone,
      ledger.customerEmail || "N/A",
      formatDate(ledger.date),
      ledger.type,
      ledger.amount,
      ledger.reference || "N/A",
      formatDate(ledger.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) =>
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
    link.download = `ledgers-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Ledger Management"
        description="Manage statements, tracks transactional history, debits and credits."
      />

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg font-medium"
            onClick={() => setFormVisible(true)}
          >
            Add Ledger Entry
          </Button>
        </div>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="New Ledger Transaction">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  {...register("customerName")}
                  placeholder="Enter customer full name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  {...register("customerPhone")}
                  placeholder="Enter contact number"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register("customerEmail")}
                  placeholder="customer@domain.com"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="date">Transaction Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Ledger Type</Label>
                <Select {...register("type")}>
                  <SelectTrigger className="w-full mt-[2px]">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  {...register("reference")}
                  placeholder="Bill details, invoice number etc."
                />
                {errors.reference && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.reference.message}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Enter details about the transaction"
                />
                {errors.description && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  {...register("remarks")}
                  placeholder="Internal audit notes..."
                />
                {errors.remarks && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.remarks.message}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="justify-end flex gap-3 pt-4 px-0">
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setFormVisible(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Entry"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
          <SearchField
            id="ledger-search"
            value={filter}
            onChange={setFilter}
            className="w-full sm:w-auto flex-1"
            placeholder="Search by customer name, voucher or reference..."
          />
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              id="ledger-type-filter"
              className="block min-w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={downloadRecords}
            >
              Export
              <Download className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <PageSection title="Ledger Book">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voucher No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-6"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              ledgers.map((ledger: any) => (
                <TableRow key={ledger._id}>
                  <TableCell className="font-medium">
                    {ledger.voucherNo || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium text-sm">
                        {ledger.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {ledger.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ledger.date ? formatDate(ledger.date) : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                        ledger.type === "credit"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {ledger.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-right sm:text-left">
                    Rs. 
                    {Number(ledger.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ledger.reference || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* <button className="flex items-center text-primary/90 hover:text-primary p-1 rounded">
                        <Eye className="h-4 w-4" />
                      </button> */}
                      <button
                        onClick={() => setEditId(ledger._id)}
                        className="flex items-center text-green-600 hover:text-green-700 p-1 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setItemToRemove(ledger._id)}
                        className="flex items-center text-red-600 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {ledgerData?.pagination?.totalPages > 1 && (
          <div className="mt-4">
            <TablePagination
              page={page}
              totalPages={ledgerData?.pagination?.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        {editId && (
          <LedgerEditForm ledgerId={editId} onClose={() => setEditId(null)} />
        )}

        <ConfirmDialog
          open={itemToRemove !== null}
          title="Remove Ledger Record"
          message="Are you sure you want to permanently delete this ledger transaction entry?"
          onConfirm={confirmDelete}
          onCancel={() => setItemToRemove(null)}
        />
      </PageSection>
    </div>
  );
}
