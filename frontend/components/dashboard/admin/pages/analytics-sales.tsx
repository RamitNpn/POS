"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  MetricCard,
  PageSection,
  SearchField,
} from "@/components/dashboard/admin/shared";
import { useAllSales } from "@/hooks/admin/sales/getTopSells";
import { TSalesAnalytics, TSalesCategory } from "@/lib/types/sales.types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function SalesAnalyticsPage() {
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: getRevenue } = useAllSales({});
  const revenueData: TSalesAnalytics | undefined = getRevenue;

  const downloadRecords = () => {
    if (!revenueData?.salesByCategory?.length) return;

    const headers = ["SN", "Category", "Sales", "Share"];

    const rows = revenueData?.salesByCategory.map(
      (o: TSalesCategory, i: number) => {
        return [i + 1, o.category, o.sales, o.percentage + "%"];
      },
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | number)[]) =>
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
    link.download = `top-sales-report-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Sales Analytics"
        description="Understand top performing days and category performance."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          title="Revenue trend"
          value={`Rs ${(revenueData?.totalRevenue ?? 0).toFixed(2)}`}
        />

        <MetricCard
          title="Categories"
          value={revenueData?.totalCategories ?? 0}
        />

        <MetricCard
          title="Top category"
          value={revenueData?.topCategory || "-"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
        <SearchField
          id="user-search"
          value={search}
          onChange={setSearch}
          placeholder="Search by order number or customer name..."
          className="w-full"
        />

        <div>
          <label className="text-sm text-muted-foreground">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <Button
          variant="default"
          className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
          onClick={downloadRecords}
        >
          Export
          <Download className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <PageSection title="Category Performance">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {revenueData?.salesByCategory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              revenueData?.salesByCategory?.map((item: TSalesCategory) => (
                <TableRow key={item.category}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>Rs {item.sales.toFixed(2)}</TableCell>
                  <TableCell>{item.percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
