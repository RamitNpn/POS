"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import QRPaymentPanel from "./QRPaymentPanel";
import PrintInvoice from "./PrintableInvoice";
import { X } from "lucide-react";

export default function InvoiceModal({ order, open, onClose }: any) {
  const [method, setMethod] = useState("cash");
  const [paid, setPaid] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${order?.id || "order"}`,
  });

  if (!open || !order) return null;

  const total = order.items.reduce(
    (sum: number, i: any) => sum + i.qty * i.price,
    0,
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#1c1c1c] rounded-xl border border-[#333] p-5 h-[60vh] overflow-y-scroll">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Invoice</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-200" />
          </button>
        </div>

        {/* Order Details */}
        <div className="mt-4 space-y-2 text-sm text-gray-300">
          <p>
            <b>Customer:</b> {order.customer}
          </p>
          <p>
            <b>Table:</b> {order.table}
          </p>
        </div>

        {/* Items */}
        <div className="mt-4 border-t border-[#333] pt-3 space-y-1">
          {order.items.map((i: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {i.name} x{i.qty}
              </span>
              <span>₹{i.qty * i.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 flex justify-between font-bold text-lg text-yellow-400">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <p className="text-sm mb-2 text-gray-400">Payment Method</p>

          <div className="flex flex-wrap gap-2">
            {["cash", "e-pay", "e-banking", "other"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-1 rounded text-sm border ${
                  method === m
                    ? "bg-yellow-400 text-black"
                    : "border-[#333] text-gray-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* QR */}
        {method === "e-pay" && (
          <div className="mt-4">
            <QRPaymentPanel amount={total} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            onClick={handlePrint}
            disabled={!paid}
            className={`w-full sm:w-auto px-4 py-2 rounded text-white transition-colors ${
              paid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            Print Invoice
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-[#262626] hover:bg-[#333] rounded transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => setPaid(true)}
            disabled={paid}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition-colors ${
              paid
                ? "bg-green-600 text-white cursor-default"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {paid ? "Paid ✓" : "Mark as Paid"}
          </button>
        </div>
      </div>

      <div className="hidden">
        <div ref={printRef}>
          <PrintInvoice order={order} paymentMethod={method} />
        </div>
      </div>
    </div>
  );
}
