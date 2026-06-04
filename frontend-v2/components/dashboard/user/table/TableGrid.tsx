import { Table } from "@/data/TableData";
import TableCard from "./TableCards";

export default function TableGrid({ tables }: { tables: Table[] }) {
  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
      "
    >
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  );
}