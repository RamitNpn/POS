"use client";

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
  statusStyle,
  MetricCard,
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useAllOrders } from "@/hooks/admin/orders/getAllOrders";
import { TOrder } from "@/lib/types/order.types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export default function TaxReportsPage() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: orderData } = useAllOrders({
    search: search,
    status: "completed",
    from: fromDate,
    to: toDate,
  });

  const orders = orderData?.data || [];
  const taxTotal = orders.reduce(
    (sum: string, order: TOrder) => sum + order.tax,
    0,
  );

  const downloadRecords = () => {
    if (!orders?.length) return;

    const headers = [
      "SN",

      "Order Number",
      "Customer Name",

      "Subtotal (Rs)",
      "Tax (Rs)",
      "Discount (Rs)",
      "Service Charge (Rs)",
      "Total (Rs)",
      "Status",
      "Created At",
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

        o.orderNumber,
        o.customerName,

        o.subtotal,
        o.tax,
        o.discount,
        o.serviceCharge,
        o.total,

        o.status,
        formatDate(o.createdAt),
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
    link.download = `local_vibes_tax-reports-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Tax Reports"
        description="Review collected sales tax and compliance summaries."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total tax" value={`Rs ${taxTotal.toFixed(2)}`} />
        <MetricCard title="Tax entries" value={orders.length} />
        <MetricCard
          title="Average tax"
          value={
            orders.length
              ? `Rs ${(taxTotal / orders.length).toFixed(2)}`
              : "Rs 0.00"
          }
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

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
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
      <PageSection title="Orders by tax collected">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Sub-total</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Service Charge</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CreatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: TOrder) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>Rs {order.subtotal.toFixed(2)}</TableCell>
                  <TableCell>Rs {order.tax.toFixed(2)}</TableCell>
                  <TableCell>Rs {(order.discount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    Rs {(order.serviceCharge || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>Rs {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
