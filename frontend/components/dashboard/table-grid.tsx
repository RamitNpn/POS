import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Table, TableStatus } from "@/lib/types";
import { Button } from "../ui/button";

interface TableGridProps {
  tables: Table[];
  onTableClick?: (table: Table) => void;
  title?: string;
}

const statusConfig: Record<
  TableStatus,
  { label: string; className: string; cardClass: string }
> = {
  available: {
    label: "Available",
    className: "bg-success/20 text-success border-success/30",
    cardClass: "border-success/30 hover:border-success/50",
  },
  occupied: {
    label: "Occupied",
    className: "bg-primary/20 text-primary border-primary/30",
    cardClass: "border-primary/30 hover:border-primary/50",
  },
  reserved: {
    label: "Reserved",
    className: "bg-warning/20 text-warning border-warning/30",
    cardClass: "border-warning/30 hover:border-warning/50",
  },
  cleaning: {
    label: "Cleaning",
    className: "bg-muted text-muted-foreground border-muted",
    cardClass: "border-muted hover:border-muted-foreground/30",
  },
  "out-of-service": {
    label: "Out of service",
    className: "bg-slate-500/20 text-slate-200 border-slate-500/30",
    cardClass: "border-slate-500/30 hover:border-slate-500/50",
  },
};

interface TableCardProps {
  table: Table;
  onClick?: () => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  const status = statusConfig[table.status];

  return (
    <Card
      className={cn(
        "bg-card cursor-pointer transition-all duration-200",
        status.cardClass,
        onClick && "hover:shadow-md",
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-secondary text-xl font-bold text-foreground">
          {table.number}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {table.capacity} seats
        </p>
        <Badge variant="outline" className={cn("text-xs", status.className)}>
          {status.label}
        </Badge>
        {table.status === "occupied" && (
          <div className="lg:flex grid grid-cols items center gap-2 text-[10px] lg:text-[13px] mt-2">
            <button className="border-none outline-none cursor-pointer rounded-md bg-yellow-800 px-2 py-1">
              Free Space
            </button>
            <a href={`/dashboard/waiter/menu?tableId=${table.id}`} className="border-none outline-none cursor-pointer rounded-md bg-lime-800 px-2 py-1">
              Re-Order
            </a>
          </div>
        )}{" "}
      </CardContent>
    </Card>
  );
}

export function TableGrid({ tables, onTableClick, title }: TableGridProps) {
  // Group tables by section
  const sections = tables.reduce(
    (acc, table) => {
      if (!acc[table.section]) {
        acc[table.section] = [];
      }
      acc[table.section].push(table);
      return acc;
    },
    {} as Record<string, Table[]>,
  );

  return (
    <Card className="bg-card border-border">
      {title && (
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "" : "pt-6"}>
        <div className="space-y-6">
          {Object.entries(sections).map(([section, sectionTables]) => (
            <div key={section}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {section}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sectionTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onClick={
                      onTableClick ? () => onTableClick(table) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TableStatsProps {
  tables: Table[];
}

export function TableStats({ tables }: TableStatsProps) {
  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-card">
        Total: {stats.total}
      </Badge>
      <Badge variant="outline" className={statusConfig.available.className}>
        Available: {stats.available}
      </Badge>
      <Badge variant="outline" className={statusConfig.occupied.className}>
        Occupied: {stats.occupied}
      </Badge>
      <Badge variant="outline" className={statusConfig.reserved.className}>
        Reserved: {stats.reserved}
      </Badge>
      <Badge variant="outline" className={statusConfig.cleaning.className}>
        Cleaning: {stats.cleaning}
      </Badge>
    </div>
  );
}
