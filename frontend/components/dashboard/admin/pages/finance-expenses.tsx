"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  MetricCard,
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";
import {
  createExpenseSchema,
  TCreateExpenseSchema,
} from "@/lib/validations/expenses.validation";
import { expensesApi } from "@/lib/api/expenses.api";
import { useAllExpenses } from "@/hooks/admin/expenses/getAllExpenses";
import { TExpense } from "@/lib/types/expenses.types";
import { expenseCategories } from "@/data/expensesOptions";
import { Download } from "lucide-react";
import { useAllSuppliers } from "@/hooks/admin/supplier/getAllSupplier";
import { TSupplier } from "@/lib/types/supplier.types";

export default function FinanceExpensesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: expensesData = [] } = useAllExpenses({
    category: category,
    supplier: supplier,
    search: search,
  });
  const expenses = expensesData?.data ?? [];

  const { data: supplierData } = useAllSuppliers({});

  const suppliers = supplierData?.data ?? [];

  const total = expenses.reduce(
    (sum: number, e: TExpense) => sum + e.amount,
    0,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
      date: "",
      vendorName: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: expensesApi.createExpenseApi,
    onSuccess: () => {
      toast({
        title: "Expense Added",
        description: "Expense has been recorded successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      reset();
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add expense",
      });
    },
  });

  const onSubmit = (data: TCreateExpenseSchema) => {
    mutate(data);
  };

  const downloadRecords = () => {
    setSearch("");
    setCategory("");
    setSupplier("");

    if (!expenses?.length) return;

    const headers = [
      "SN",
      "Expense ID",
      "Category",
      "Description",
      "Vendor Name",
      "Amount (Rs)",
      "Date",
      "Created At",
      "Updated At",
    ];

    const rows = expenses.map((item: TExpense, index: number) => [
      index + 1,
      item._id,
      item.category,
      item.description,
      item.vendorName,
      item.amount,
      formatDate(item.date),
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
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
    link.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Expense Management"
        description="Track costs and spending categories across operations."
      />

      {/* METRICS */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total expenses" value={`Rs ${total.toFixed(2)}`} />
        <MetricCard title="Entries" value={expenses.length} />
        <MetricCard
          title="Average spend"
          value={
            expenses.length
              ? `Rs ${(total / expenses.length).toFixed(2)}`
              : "Rs 0.00"
          }
        />
      </div>

      {/* ADD BUTTON */}
      {!showForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>Add Expense</Button>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <PageSection title="Add Expense">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <Label>Category</Label>

              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="max-h-60 overflow-y-auto">
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Description</Label>
              <Input
                {...register("description")}
                placeholder="Add some details.."
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="Add amount detail.."
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label>Vendor</Label>
              <Input
                {...register("vendorName")}
                placeholder="Add suppliers name.."
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </PageSection>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* SEARCH */}
          <div className="w-full xl:flex-1">
            <SearchField
              id="expenses-search"
              label="Search Expense Record"
              value={search}
              onChange={setSearch}
              placeholder="Search expenses..."
              className="w-full"
            />
          </div>

          {/* FILTERS + ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap gap-3 w-full xl:w-auto xl:items-center lg:mt-4">
            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="expense-category-filter"
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm 
                 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Category</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* SUPPLIER */}
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              id="expense-supplier-filter"
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm 
                 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Supplier</option>
              {suppliers.map((sup: TSupplier) => (
                <option key={sup._id} value={sup.name}>
                  {sup.name}
                </option>
              ))}
            </select>

            {/* EXPORT BUTTON */}
            <Button
              variant="default"
              className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
              onClick={downloadRecords}
            >
              Export
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <PageSection title="Expense Ledger">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No expenses record found.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense: TExpense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>Rs {expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.vendorName ?? "Internal"}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
