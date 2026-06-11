"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { OrderList } from "@/components/dashboard/order-card";
import { api } from "@/lib/api/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderStatus, PaymentMethod } from "@/lib/types";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "served", label: "Served" },
];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "mobile", label: "Mobile" },
  { value: "split", label: "Split" },
];

const statusLabel: Record<OrderStatus, { label: string; tone: string }> = {
  pending: {
    label: "Pending",
    tone: "bg-warning/20 text-warning border-warning/30",
  },
  preparing: {
    label: "Preparing",
    tone: "bg-info/20 text-info border-info/30",
  },
  ready: {
    label: "Ready",
    tone: "bg-success/20 text-success border-success/30",
  },
  served: {
    label: "Served",
    tone: "bg-primary/20 text-primary border-primary/30",
  },
  completed: {
    label: "Completed",
    tone: "bg-muted text-muted-foreground border-muted",
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

export default function CashierOrdersPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["active-orders"],
    queryFn: api.getActiveOrders,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionNotes, setTransactionNotes] = useState("");
  const [paidOrders, setPaidOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedOrder && orders.length > 0) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.number.toString().includes(searchTerm) ||
        order.waiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());


      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const invoiceOrder = selectedOrder && {
    ...selectedOrder,
    paymentStatus: paidOrders[selectedOrder.id]
      ? "paid"
      : selectedOrder.paymentStatus,
    paymentMethod,
  };

  const handleMarkPaid = () => {
    if (!selectedOrder) return;
    setPaidOrders((prev) => ({ ...prev, [selectedOrder.id]: true }));
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const paymentLabel =
    invoiceOrder?.paymentStatus === "paid" ? "Paid" : "Pending";

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Cashier Orders"
        description="Search active orders, select a bill, and generate a printable invoice."
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 w-full">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {orders.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Ready to Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {orders.filter((order) => order.status === "served").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Selected Order</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {invoiceOrder?.orderNumber || "None"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={
                  invoiceOrder?.paymentStatus === "paid"
                    ? "bg-success/20 text-success"
                    : "bg-warning/20 text-warning"
                }
              >
                {paymentLabel}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Order Filter</CardTitle>
              <CardDescription>
                Find the right order quickly by status or order number.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Search
                </label>
                <Input
                  placeholder="Order #, table, waiter"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as OrderStatus | "all")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <OrderList
            orders={filteredOrders}
            title="Active orders"
            emptyMessage="No matching orders"
            onOrderClick={(order) => setSelectedOrder(order)}
          />
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Invoice Generator</CardTitle>
            <CardDescription>
              Select an order and print the invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!invoiceOrder ? (
              <p className="text-center text-muted-foreground py-8">
                Select an order from the list to load invoice details.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order</p>
                        <p className="font-semibold text-foreground">
                          {invoiceOrder.orderNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Table</p>
                        <p className="font-semibold text-foreground">
                          {invoiceOrder.table.number}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Server</p>
                        <p className="font-medium text-foreground">
                          {invoiceOrder.waiter.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge
                          className={statusLabel[invoiceOrder.status].tone}
                        >
                          {statusLabel[invoiceOrder.status].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium text-foreground">
                          {invoiceOrder.customerName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Payment method
                    </label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(value as PaymentMethod)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose payment" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Notes
                    </label>
                    <Input
                      value={transactionNotes}
                      onChange={(event) =>
                        setTransactionNotes(event.target.value)
                      }
                      placeholder="Optional payment note"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="space-y-2">
                    {invoiceOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {item.menuItem.name}
                          </p>
                          <p className="text-muted-foreground">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${invoiceOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${invoiceOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>Total</span>
                      <span>${invoiceOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1" onClick={handleMarkPaid}>
                    Mark Paid
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handlePrintInvoice}
                  >
                    Print Invoice
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="print:hidden">
        <section id="invoice-print-template" className="hidden" />
      </div>
    </div>
  );
}
