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

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [printedTicket, setPrintedTicket] = useState<any | null>(null);

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

  const { data: ticketData } = useLiveTickets({});
  const tickets = ticketData?.data ?? [];
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
    </div>
  );
}
