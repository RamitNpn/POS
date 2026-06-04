"use client";

export default function InvoiceModal({ invoice, onClose }: any) {
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

      <div className="bg-white text-black w-[500px] p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-4">
          Invoice {invoice.id}
        </h2>

        <div className="space-y-2">

          <p>Customer: {invoice.customer}</p>
          <p>Amount: ${invoice.amount}</p>
          <p>Status: {invoice.status}</p>
          <p>Date: {invoice.date}</p>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={printInvoice}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Print
          </button>

          <button
            onClick={onClose}
            className="text-black"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}