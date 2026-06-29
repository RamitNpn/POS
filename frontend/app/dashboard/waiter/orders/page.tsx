"use client";

import { useRef, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { PageSection } from "@/components/dashboard/admin/shared";
import { TicketTable } from "@/components/shared/ticketTable";
import { Status } from "@/lib/types/ticket.types";
import { Button } from "@/components/ui/button";
import { useLiveTickets } from "@/hooks/cahsier/getAllLiveTickets";

const orderStatusOptions: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "served", label: "Served" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function WaiterOrdersPage() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState("pending");

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [printedTicket, setPrintedTicket] = useState<any | null>(null);

  const { data: ticketData } = useLiveTickets({ status: statusFilter });
  const tickets = ticketData?.data ?? [];

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

  const filteredTickets = filterTicketsByDateRange(tickets);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Orders"
        description="View the waiter order queue and completed history."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Active orders filter
          </h2>
          <p className="text-sm text-muted-foreground">
            Filter waiter orders by status.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
              <SelectContent>
                <SelectItem value="pending"> Active </SelectItem>
                <SelectItem value="served"> Served </SelectItem>
                <SelectItem value="cancelled"> Cancelled </SelectItem>
                <SelectItem value="completed"> Completed </SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
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
            variant="secondary"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <PageSection title="Ticket Records">
          <TicketTable
            tickets={filteredTickets}
            onView={setSelectedTicket}
            onPrint={(ticket) => {
              setPrintedTicket(ticket);

              setTimeout(() => {
                document.getElementById("ticket-printer")?.click();
              }, 100);
            }}
          />
        </PageSection>
      </div>
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
              <DialogDescription>Complete checkout details</DialogDescription>
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
                    <div key={it.menuItemId} className="flex justify-between">
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
  );
}
