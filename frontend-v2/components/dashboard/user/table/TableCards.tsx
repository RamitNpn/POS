import { Table } from "@/data/TableData";
import clsx from "clsx";

export default function TableCard({ table }: { table: Table }) {
  const isBooked = table.status === "booked";

  return (
    <div
      className={clsx(
        "rounded-xl p-4 flex flex-col justify-between aspect-[4/3] border transition",
        "bg-[#1c1c1c] border-white/5 hover:border-yellow-400/40",
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <span className="font-semibold">{table.name}</span>

        <span
          className={clsx(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
            isBooked
              ? "bg-green-500/10 text-green-400"
              : "bg-yellow-400/10 text-yellow-400",
          )}
        >
          {table.status}
        </span>
      </div>

      {/* Avatar / Initials */}
      <div className="flex justify-center items-center flex-1">
        <div
          className={clsx(
            "w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm",
            isBooked ? "bg-green-500 text-white" : "bg-yellow-400 text-black",
          )}
        >
          {table.initials}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400">
        Seats: <span className="font-medium">{table.seats}</span>
      </div>
    </div>
  );
}
