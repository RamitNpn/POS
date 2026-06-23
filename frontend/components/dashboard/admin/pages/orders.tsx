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
  formatDate,
  SearchField,
} from "@/components/dashboard/admin/shared";
import { TOrder } from "@/lib/types/order.types";
import { useAllOrders } from "@/hooks/admin/orders/getAllOrders";
import { useRef, useState } from "react";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import OrderDetailsModal from "../order-details-modal";
import PrintInvoice from "../../billing-modal";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [printOrder, setPrintOrder] = useState<TOrder | null>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: printOrder?.orderNumber || "invoice",
  });
  const { data: orderData } = useAllOrders({
    search,
    status: statusFilter,
  });
  const orders = orderData?.data || [];
  console.log(orders);
  const activeOrders = (orders: TOrder[]) =>
    orders?.filter(
      (order) =>
        order.status === "active" ||
        order.status === "completed" ||
        order.status === "cancelled",
    );

  const downloadRecords = () => {
    if (!orders?.length) return;

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
    link.download = `local_vibes_orders-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Active Orders"
        description="Monitor orders currently in progress."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Open orders"
          value={
            activeOrders(orders).filter(
              (order: TOrder) => order.status === "active",
            ).length
          }
        />
        <MetricCard
          title="Completed"
          value={
            activeOrders(orders).filter(
              (order: TOrder) => order.status === "completed",
            ).length
          }
        />
        <MetricCard
          title="Cancelled"
          value={
            activeOrders(orders).filter(
              (order: TOrder) => order.status === "cancelled",
            ).length
          }
        />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <div className="flex items-center justify-between gap-2">
          <SearchField
            id="user-search"
            value={search}
            onChange={setSearch}
            className="w-full sm:w-auto flex-1"
            placeholder="Search by name, email, role or status"
          />
          <div className="flex items-center gap-3">
            <select
              id="user-role-filter"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={downloadRecords}
            >
              Export
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <PageSection title="Order Queue">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-200">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              activeOrders(orders).map((order: TOrder) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.table?.name}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.waiter?.name ?? "N/A"}</TableCell>
                  <TableCell>Rs {order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.customerName || "Guest"}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        className="text-gray-300 cursor-pointer hover:text-white"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="secondary"
                        className="text-gray-300 cursor-pointer hover:text-white"
                        size="icon"
                        onClick={() => {
                          setPrintOrder(order);

                          setTimeout(() => {
                            handlePrintInvoice();
                          }, 100);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
      <OrderDetailsModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={invoiceRef}>
          <PrintInvoice order={printOrder} />
        </div>
      </div>
    </div>
  );
}
