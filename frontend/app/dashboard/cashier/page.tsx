"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Order, PaymentMethod } from "@/lib/types";
import { useReactToPrint } from "react-to-print";
import { useAllTables } from "@/hooks/admin/table/getAllTables";
import { OrderStatus } from "@/lib/types/order.types";
import {
  formatDate,
  PageSection,
  statusStyle,
} from "@/components/dashboard/admin/shared";
import { Eye, Printer } from "lucide-react";
import OrderTicketPrint from "@/components/dashboard/cashier/ticket-print";
import { TicketTable } from "@/components/shared/ticketTable";
import { useLiveTickets } from "@/hooks/cahsier/getAllTicket";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "mobile", label: "Mobile" },
  { value: "split", label: "Split" },
];

export default function CashierDashboard() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const filterTicketsByDateRange = (tickets: any[]) => {
    if (!fromDate && !toDate) return tickets;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return tickets.filter((ticket) => {
      const createdAt = new Date(ticket.createdAt);

      if (from && createdAt < from) return false;

      if (to) {
        const endOfTo = new Date(to);
        endOfTo.setHours(23, 59, 59, 999);

        if (createdAt > endOfTo) return false;
      }

      return true;
    });
  };

  const { data: ticketData } = useLiveTickets({
    search: searchTerm,
  });
  const tickets = ticketData?.data ?? [];
  const filteredTickets = filterTicketsByDateRange(tickets);

  const { data: orders = [] } = useQuery({
    queryKey: ["active-orders"],
    queryFn: api.getActiveOrders,
  });

  const { data: tableData } = useAllTables({ filter: "available" });

  const tables = tableData?.data ?? [];

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [printedTicket, setPrintedTicket] = useState<any | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paidOrders, setPaidOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedOrder && orders.length > 0) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  const invoiceOrder = selectedOrder && {
    ...selectedOrder,
    paymentStatus: paidOrders[selectedOrder.id]
      ? "completed"
      : selectedOrder.paymentStatus,
    paymentMethod,
  };

  const handleMarkPaid = () => {
    if (!selectedOrder) return;
    setPaidOrders((prev) => ({ ...prev, [selectedOrder.id]: true }));
  };

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: selectedTicket?.orderNumber || "invoice",
  });

  const checkoutReady = orders.filter((order) => order.status === "served");

  return (
    <div className="space-y-6 print:bg-white">
      <DashboardHeader
        title="Cashier Checkout"
        description="A simplified checkout workspace with quick invoice generation and payment handling."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Total active orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {orders.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Ready for checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {checkoutReady.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Pending payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {orders.filter((order) => order.paymentStatus !== "paid").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Tables in house</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {tables.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Order Filter</CardTitle>
              <CardDescription>
                Find the right order quickly by status or order number.
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col gap-4 px-4 lg:flex-row lg:items-end lg:justify-between">
              {/* SEARCH */}
              <div className="w-full lg:max-w-md space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Search
                </label>

                <Input
                  className="w-full"
                  placeholder="Order #, table, waiter"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              {/* DATE FILTERS */}
              <div className="flex items-center flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap lg:flex-nowrap">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label className="text-sm text-muted-foreground">From</label>
                  <input
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-10 w-full sm:w-auto rounded-md border bg-background px-3 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <label className="text-sm text-muted-foreground">To</label>
                  <input
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-10 w-full sm:w-auto rounded-md border bg-background px-3 text-sm"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Ticket Records</CardTitle>
            </CardHeader>
            <CardContent className="w-[280px] md:w-[700px] lg:w-full overflow-x-scroll">
              <TicketTable
                tickets={filteredTickets}
                onView={setSelectedTicket}
                onPrint={(ticket) => {
                  setPrintedTicket(ticket);
                  setTimeout(() => {
                    handlePrintInvoice();
                  }, 100);
                }}
              />
            </CardContent>
          </Card>

          {selectedTicket && (
            <Dialog
              open={!!selectedTicket}
              onOpenChange={(open) => {
                if (!open) setSelectedTicket(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order {selectedTicket.orderNumber}</DialogTitle>
                  <DialogDescription>
                    Complete checkout details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div>Order: {selectedTicket.orderNumber}</div>
                  <div>Customer: {selectedTicket.customerName || "-"}</div>
                  <div>Table: {selectedTicket.table?.tableName || "-"}</div>
                  <div>Waiter: {selectedTicket.waiter?.name || "-"}</div>
                  <div>Status: {selectedTicket.status}</div>
                  <div className="border-t pt-3">
                    <h4 className="font-semibold">Items</h4>
                    <div className="space-y-2 mt-2">
                      {selectedTicket.items?.map((it: any) => (
                        <div
                          key={it.menuItemId}
                          className="flex justify-between"
                        >
                          <div>
                            {it.name} × {it.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="bg-card border-border print:hidden">
        <CardHeader>
          <CardTitle>Order preview for print</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page includes a built-in invoice view when you press Print.
          </p>
        </CardContent>
      </Card>

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={invoiceRef}>
          <OrderTicketPrint order={printedTicket} />
        </div>
      </div>
    </div>
  );
}
