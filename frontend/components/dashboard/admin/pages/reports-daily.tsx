"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
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
import { TSalesReport } from "@/lib/types/report.types";
import { useAllReports } from "@/hooks/admin/report/getAllDailyReport";
import { Download, Eye } from "lucide-react";
import { useAllOrdersByDate } from "@/hooks/admin/orders/getAllOrderByDate";
import { TOrder } from "@/lib/types/order.types";
import { orderApi } from "@/lib/api/order.api";

export default function DailyReportsPage() {
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: reportResponse } = useAllReports({
    page: 1,
    limit: 100,
    from: fromDate,
    to: toDate,
  });

  const reports = reportResponse?.data ?? [];

  const downloadReports = () => {
    const csv = [
      [
        "Report Date",
        "Revenue",
        "Orders",
        "Cash Sales",
        "Online Sales",
        "Discount",
        "Tax",
        "Generated At",
      ],
      ...reports.map((r: TSalesReport) => [
        r.reportDate,
        r.totalRevenue,
        r.totalOrders,
        r.cashSales,
        r.onlineSales,
        r.totalDiscount,
        r.totalTax,
        r.generatedAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "sales-reports.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadDailyRecords = async (date: string) => {
    try {
      const res = await orderApi.getOrderByDateApi({
        dateReport: date,
      });

      const orders = res.success ? res.data : res.data?.data;

      if (!orders || !orders.length) {
        alert("No orders found for this date.");
        return;
      }

      const headers = [
        "SN",

        "Order Number",
        "Order ID",
        "Status",
        "Payment Status",
        "Customer Name",

        "Table Name",
        "Table Capacity",
        "Table Status",

        "Waiter ID",
        "Waiter Name",
        "Waiter Email",

        "Items",

        "Subtotal (Rs)",
        "Tax (Rs)",
        "Discount (Rs)",
        "Service Charge (Rs)",
        "Total (Rs)",

        "Notes",
        "Ticket Count",
        "Created At",
        "Updated At",
      ];

      const rows = orders.map((o: TOrder, i: number) => {
        const itemsText = o.items
          .map(
            (item) =>
              `${item.menuItem} x${item.quantity} @${item.price} = ${item.total}`,
          )
          .join(" | ");

        return [
          i + 1,

          o._id,
          o.orderNumber,
          o.status,
          o.paymentStatus,
          o.customerName,

          o.table?.name,
          o.table?.capacity,
          o.table?.status,

          o.waiter?._id,
          o.waiter?.name,
          o.waiter?.email,

          itemsText,

          o.subtotal,
          o.tax,
          o.discount,
          o.serviceCharge,
          o.total,

          o.notes,
          o.ticketCount,
          formatDate(o.createdAt),
          formatDate(o.updatedAt),
        ];
      });

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
      link.download = `local_vibes_orders-${date.toString().split("T")[0]}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading records:", err);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Daily Reports"
        description="Review top performing categories and item volumes."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto]">
        <SearchField
          id="report-search"
          value={search}
          onChange={setSearch}
          placeholder="Search report date..."
          className="w-full"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">From</label>

          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">To</label>

          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <Button
          variant="default"
          onClick={downloadReports}
          className="w-full self-end bg-green-600 text-white hover:bg-green-700 md:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <PageSection title="Daily Reports">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Date</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Cash Sales</TableHead>
              <TableHead>Online Sales</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Generated At</TableHead>
              {/* <TableHead>Action</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report: TSalesReport) => (
                <TableRow key={report.id}>
                  <TableCell>{formatDate(report.reportDate)}</TableCell>

                  <TableCell>Rs {report.totalRevenue.toFixed(2)}</TableCell>

                  <TableCell>{report.totalOrders}</TableCell>

                  <TableCell>Rs {report.cashSales.toFixed(2)}</TableCell>

                  <TableCell>Rs {report.onlineSales.toFixed(2)}</TableCell>

                  <TableCell>Rs {report.totalDiscount.toFixed(2)}</TableCell>

                  <TableCell>Rs {report.totalTax.toFixed(2)}</TableCell>

                  <TableCell>{formatDate(report.generatedAt)}</TableCell>
                  {/* <TableCell>
                    <div className="flex gap-3">
                      <button className="flex items center text-primary/90 hover:text-primary/80 justify-center p-1 rounded">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => downloadDailyRecords(report.reportDate)}
                        className="flex items center text-green-600 justify-center p-1 rounded"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
