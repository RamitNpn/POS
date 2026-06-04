"use client";

import FilterTabs, { TableFilter } from "@/components/dashboard/user/table/FilterTab";
import TableGrid from "@/components/dashboard/user/table/TableGrid";
import { tablesData } from "@/data/TableData";
import { useMemo, useState } from "react";

export default function TablesPage() {
  const [filter, setFilter] = useState<TableFilter>("all");

  // Filter logic (scalable for API later)
  const filteredTables = useMemo(() => {
    if (filter === "all") return tablesData;

    return tablesData.filter((table) => table.status === filter);
  }, [filter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition">
            ←
          </button>

          <h1 className="text-xl sm:text-2xl font-bold">Tables</h1>
        </div>

        <FilterTabs active={filter} onChange={setFilter} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-400">
        <span>Total: {tablesData.length}</span>
        <span>
          Booked: {tablesData.filter((t) => t.status === "booked").length}
        </span>
        <span>
          Available: {tablesData.filter((t) => t.status === "available").length}
        </span>
      </div>

      <TableGrid tables={filteredTables} />
    </>
  );
}
