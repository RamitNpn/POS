import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableStatus, TTable } from "@/lib/types/table.types";
import { TTableStats } from "@/lib/types/stats.types";
import { Table2 } from "lucide-react";

interface TableGridProps {
  tables: TTable[];
  onTableClick?: (table: TTable) => void;
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
};

interface TableCardProps {
  table: TTable;
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
          {table.name}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {table.capacity} seats
        </p>
        <Badge variant="outline" className={cn("text-xs", status.className)}>
          {status.label}
        </Badge>
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
    {} as Record<string, TTable[]>,
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
          {tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Table2 className="size-6 text-muted-foreground" />
              </div>

              <h3 className="text-base font-semibold text-foreground">
                No Tables Found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                There are currently no tables available in this section.
              </p>
            </div>
          ) : (
            Object.entries(sections).map(([section, sectionTables]) => (
              <div key={section} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {sectionTables.length} table
                    {sectionTables.length !== 1 ? "s" : ""}
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {sectionTables.map((table) => (
                    <TableCard
                      key={table._id}
                      table={table}
                      onClick={
                        onTableClick ? () => onTableClick(table) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TableStatsProps {
  stats: TTableStats;
}

export function TableStats({ stats }: TableStatsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-card">
        Total: {stats?.total}
      </Badge>

      <Badge variant="outline" className={statusConfig.available.className}>
        Available: {stats?.available}
      </Badge>

      <Badge variant="outline" className={statusConfig.occupied.className}>
        Occupied: {stats?.occupied}
      </Badge>

      <Badge variant="outline" className={statusConfig.reserved.className}>
        Reserved: {stats?.reserved}
      </Badge>
    </div>
  );
}
