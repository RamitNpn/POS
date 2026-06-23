"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { TableGrid, TableStats } from "@/components/dashboard/table-grid";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ClipboardList, Table2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useAllTables } from "@/hooks/admin/table/getAllTables";
import { TableStatus, TTable } from "@/lib/types/table.types";
import { useTableStats } from "@/hooks/shared/stats/getTableStats";
import { Status, TTicket } from "@/lib/types/ticket.types";
import { useLiveTickets } from "@/hooks/cahsier/getAllLiveTickets";

const tableStatusOptions: { value: TableStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "reserved", label: "Reserved" },
];

export default function WaiterDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [showTablePrompt, setShowTablePrompt] = useState(false);

  const handleNewOrder = () => {
    setShowTablePrompt(true);
  };

  const { data: ticketData } = useLiveTickets({});
  const tickets = ticketData?.data ?? [];

  const { data: tableStats } = useTableStats();

  const { data: tableData } = useAllTables({});

  const tables = tableData?.data ?? [];

  const handleTableClick = (table: TTable) => {
    if (table.status === "reserved") {
      toast({
        title: "Table reserved",
        description:
          "Please select an available table before creating an order.",
      });
      return;
    }

    router.push(`/dashboard/waiter/menu?tableId=${table._id}`);
  };

  const [tableStatusFilter, setTableStatusFilter] = useState<
    TableStatus | "all"
  >("all");
  const filteredTables = tables?.filter(
    (table: TTable) =>
      tableStatusFilter === "all" || table.status === tableStatusFilter,
  );

  const activeOrders = tickets.filter(
    (ticket: TTicket) => ticket.status === "pending",
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Tables"
          description="Manage tables and take orders"
        >
          <Button className="touch-target" onClick={handleNewOrder}>
            <Plus className="size-4 mr-2" />
            New Order
          </Button>
        </DashboardHeader>

        {showTablePrompt && (
          <div className="rounded-md border border-red-500 p-4 bg-muted/30 text-sm text-muted-foreground">
            Please choose an available table from the below listing to create an
            order.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-3">
        <StatsCard
          title="Today's Total Orders"
          value={tickets.length}
          icon={<ClipboardList className="size-4" />}
        />
        <StatsCard
          title="Today's Active Orders"
          value={activeOrders.length}
          icon={<Clock className="size-4" />}
        />
        <StatsCard
          title="Available Tables"
          value={
            tables?.filter((t: TTable) => t.status === "available").length || 0
          }
          icon={<Table2 className="size-4" />}
        />
      </div>

      {/* Table Status */}
      {tables && <TableStats stats={tableStats?.data} />}

      {tables && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Filter tables by status
            </h2>
            <p className="text-sm text-muted-foreground">
              Show a subset of the floor plan.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <Select
              value={tableStatusFilter}
              onValueChange={(value) =>
                setTableStatusFilter(value as TableStatus | "all")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {tableStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      {filteredTables !== undefined && (
        <TableGrid
          tables={filteredTables}
          onTableClick={handleTableClick}
          title="Floor Plan"
        />
      )}
    </div>
  );
}
