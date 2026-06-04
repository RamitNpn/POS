"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import InvoiceModal from "./InvoiceModal";
import { Download } from "lucide-react";

const invoices = [
  {
    id: "#INV001",
    customer: "John Carter",
    amount: 120,
    status: "Paid",
    date: "2026-06-01",
  },
  {
    id: "#INV002",
    customer: "Emma Watson",
    amount: 85,
    status: "Pending",
    date: "2026-06-01",
  },
  {
    id: "#INV003",
    customer: "Robert King",
    amount: 240,
    status: "Paid",
    date: "2026-06-01",
  },
];

export default function BillingTable() {
  const [selected, setSelected] = useState<any>(null);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(invoices);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "invoices.xlsx");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={exportExcel}
          className="text-green-500 x px-4 py-2 rounded font-semibold"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-zinc-400">
          <tr>
            <th className="p-4 text-left">Invoice</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-white/10">
              <td className="p-4 text-yellow-400">{inv.id}</td>
              <td className="p-4 text-white">{inv.customer}</td>
              <td className="p-4 text-green-400">${inv.amount}</td>
              <td className="p-4 text-zinc-300">{inv.status}</td>
              <td className="p-4 text-zinc-400">{inv.date}</td>

              <td className="p-4 text-center">
                <button
                  onClick={() => setSelected(inv)}
                  className="text-yellow-400 hover:text-white"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
