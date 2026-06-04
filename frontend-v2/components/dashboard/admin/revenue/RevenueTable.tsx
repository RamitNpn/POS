"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AddTransactionModal from "./AddTransactionalModal";
import { Download } from "lucide-react";

const data = [
  {
    id: "T001",
    type: "Income",
    title: "Food Sales",
    amount: 2400,
    category: "Sales",
    date: "2026-06-01",
  },
  {
    id: "T002",
    type: "Expense",
    title: "Staff Salary",
    amount: 800,
    category: "Payroll",
    date: "2026-06-01",
  },
];

export default function RevenueTable() {
  const [open, setOpen] = useState(false);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Revenue");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "revenue-report.xlsx");
  };

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={exportExcel} className="text-green-500 px-4 py-2">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-zinc-400">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Title</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-b border-white/10">
              <td className="p-4 text-yellow-400">{d.id}</td>
              <td
                className={
                  d.type === "Income"
                    ? "text-green-400 p-4"
                    : "text-red-400 p-4"
                }
              >
                {d.type}
              </td>
              <td className="p-4 text-white">{d.title}</td>
              <td className="p-4 text-white">${d.amount}</td>
              <td className="p-4 text-zinc-400">{d.category}</td>
              <td className="p-4 text-zinc-400">{d.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && <AddTransactionModal onClose={() => setOpen(false)} />}
    </div>
  );
}
