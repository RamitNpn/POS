"use client";

import { useMemo, useRef, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAllOrders } from "@/hooks/admin/orders/getAllOrders";
import { PaymentMethod, PaymentStatus, TOrder } from "@/lib/types/order.types";
import { useReactToPrint } from "react-to-print";
import { CreditCard, Download, Eye } from "lucide-react";
import { formatDate } from "@/components/dashboard/admin/shared";
import TablePagination from "@/components/shared/pagination";
import PrintInvoice from "@/components/dashboard/billing-modal";
import PaymentUpdateForm from "@/components/dashboard/cashier/updatePaymentMethod";

const paymentStatusOptions: { value: PaymentStatus | "all"; label: string }[] =
  [
    { value: "all", label: "All payments" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
  ];

const paymentMethodOptions: { value: PaymentMethod | "all"; label: string }[] =
  [
    { value: "all", label: "All methods" },
    { value: "cash", label: "Cash" },
    { value: "online", label: "Online" },
    { value: "credit", label: "Credit" },
  ];

export default function CashierReportsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [editingPaymentOrderId, setEditingPaymentOrderId] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">(
    "all",
  );
  const [printOrder, setPrintOrder] = useState<TOrder | null>(null);

  const { data: PrintOrder } = useAllOrders({});

  const { data: orderData } = useAllOrders({
    page: page,
    limit: 10,
  });
  const orders = orderData?.data || [];

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: printOrder?.orderNumber || "invoice",
  });

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return orders.filter((order: TOrder) => {
      const matchesSearch =
        !q ||
        (order.customerName || "").toLowerCase().includes(q) ||
        (order.orderNumber || "").toLowerCase().includes(q) ||
        (order.table?.name || "").toLowerCase().includes(q) ||
        (order.waiter?.name || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || order.paymentStatus === statusFilter;

      const matchesMethod =
        methodFilter === "all" || order.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [orders, searchTerm, statusFilter, methodFilter]);

  const downloadRecords = () => {
    if (!PrintOrder.data?.length) return;

    const headers = [
      "SN",

      // Order Info
      "Order Number",
      "Order ID",
      "Status",
      "Payment Status",
      "Customer Name",

      // Table Info
      "Table Name",
      "Table Capacity",
      "Table Status",

      // Waiter Info
      "Waiter ID",
      "Waiter Name",
      "Waiter Email",

      // Items (flattened string)
      "Items",

      // Financials
      "Subtotal (Rs)",
      "Tax (Rs)",
      "Discount (%)",
      "Service Charge (Rs)",
      "Total (Rs)",

      // Meta
      "Notes",
      "Ticket Count",
      "Created At",
      "Updated At",
    ];

    const rows = PrintOrder.data?.map((o: TOrder, i: number) => {
      const itemsText = o.items
        .map(
          (item) =>
            `${item.menuItem} x${item.quantity} @${item.price} = ${item.total}`,
        )
        .join(" | ");

      return [
        i + 1,

        // Order
        o._id,
        o.orderNumber,
        o.status,
        o.paymentStatus,
        o.customerName,

        // Table
        o.table?.name,
        o.table?.capacity,
        o.table?.status,

        // Waiter
        o.waiter?._id,
        o.waiter?.name,
        o.waiter?.email,

        // Items
        itemsText,

        // Financials
        o.subtotal,
        o.tax,
        o.discount,
        o.serviceCharge,
        o.total,

        // Meta
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
        title="Cashier Reports"
        description="Browse completed checkout records, search by order, and export invoices or full reports."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Report filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search
              </label>
              <Input
                placeholder="Order #, table, server"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Payment status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as PaymentStatus | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Payment method
              </label>
              <Select
                value={methodFilter}
                onValueChange={(value) =>
                  setMethodFilter(value as PaymentMethod | "all")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full" onClick={downloadRecords}>
                Export full report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total records</p>
                <p className="font-semibold text-foreground">
                  {filteredOrders.length}
                </p>
              </div>
              <Badge className="bg-primary/20 text-primary">Showing</Badge>
            </div>
            <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
              Refine the list by search, payment status, or method to locate
              invoices faster.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Checkout records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order: TOrder) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.table?.name}</TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {(order as any).customerName || "-"}
                    </TableCell>
                    <TableCell>{order.waiter?.name}</TableCell>
                    <TableCell>Rs {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          order.paymentStatus === "paid"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-warning"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="text-gray-300 cursor-pointer hover:bg-primary/90 hover:text-white"
                          size="icon"
                          onClick={() =>
                            setSelectedOrder(
                              orders.find((o: TOrder) => o._id === order._id),
                            )
                          }
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
                        <Button
                          variant="secondary"
                          className="text-gray-300 cursor-pointer hover:bg-green-700 hover:text-white"
                          size="icon"
                          onClick={() => setEditingPaymentOrderId(order._id)}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {orderData?.pagination?.totalPages > 1 && (
            <div className="mt-4">
              <TablePagination
                page={page}
                totalPages={orderData?.pagination?.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        >
          <DialogContent className="h-[90vh] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>Complete checkout details</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 space-x-2 pb-2 border-b border-bray-200">
                <span>
                  Customer: {/* @ts-ignore */}
                  {(selectedOrder as any).customerName || "-"}
                </span>
                <span>Table: {selectedOrder.table?.name}</span>
                <span>Server: {selectedOrder.waiter?.name}</span>
                <span>Status: {selectedOrder.paymentStatus}</span>
              </div>

              <div>
                <h4 className="font-semibold">Items</h4>
                <div className="space-y-2 mt-2 text-[13px]">
                  {selectedOrder.items?.map((it) => (
                    <div
                      key={it.menuItem}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">
                          {it.menuItem} x{it.quantity}
                        </div>
                      </div>
                      <div className="text-foreground">
                        Rs {(it.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rs {selectedOrder.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>Rs {selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {editingPaymentOrderId && (
        <PaymentUpdateForm
          orderId={editingPaymentOrderId}
          onClose={() => setEditingPaymentOrderId(null)}
        />
      )}
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
