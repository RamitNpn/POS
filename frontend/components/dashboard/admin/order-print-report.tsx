"use client";

import { TOrder } from "@/lib/types/order.types";

interface Props {
  order: TOrder | null;
}

export default function OrderPrintReport({ order }: Props) {
  if (!order) return null;

  return (
    <div className="bg-white text-black p-10 min-h-screen max-w-[1000px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Restaurant Order Report
          </h1>

          <h2 className="mt-6 text-xl font-semibold">
            Order No: {order.orderNumber}
          </h2>
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-bold">
            LOCALVIBES
          </h2>

          <p className="text-sm text-gray-600">
            Restaurant Management System
          </p>
        </div>
      </div>

      {/* REPORT INFO */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="mb-2">
            <strong>Prepared By:</strong>{" "}
            {order.waiter?.name || "N/A"}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="mb-2">
            <strong>Prepared For:</strong>{" "}
            {order.customerName || "Guest"}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* ORDER INFORMATION */}
      <ReportSection title="Order Information">
        <ReportRow
          label="Order Number"
          value={order.orderNumber}
        />

        <ReportRow
          label="Order Status"
          value={order.status}
        />

        <ReportRow
          label="Ticket Count"
          value={order.ticketCount}
        />

        <ReportRow
          label="Created At"
          value={new Date(order.createdAt).toLocaleString()}
        />

        <ReportRow
          label="Updated At"
          value={new Date(order.updatedAt).toLocaleString()}
        />
      </ReportSection>

      {/* TABLE */}
      <ReportSection title="Table Information">
        <ReportRow
          label="Table Name"
          value={order.table?.name}
        />

        <ReportRow
          label="Capacity"
          value={order.table?.capacity}
        />

        <ReportRow
          label="Status"
          value={order.table?.status}
        />
      </ReportSection>

      {/* WAITER */}
      <ReportSection title="Waiter Information">
        <ReportRow
          label="Name"
          value={order.waiter?.name}
        />

        <ReportRow
          label="Email"
          value={order.waiter?.email}
        />

        <ReportRow
          label="Phone"
          value={order.waiter?.phone}
        />

        <ReportRow
          label="Role"
          value={order.waiter?.role}
        />

        <ReportRow
          label="Status"
          value={order.waiter?.status}
        />
      </ReportSection>

      {/* ITEMS */}
      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-bold text-orange-600 uppercase">
          Order Items
        </h2>

        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-teal-900 text-white">
              <th className="border p-2 text-left">
                Item
              </th>

              <th className="border p-2">
                Qty
              </th>

              <th className="border p-2">
                Price
              </th>

              <th className="border p-2">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 border-gray-200">
                  {item.menuItem}
                </td>

                <td className="border p-2 border-gray-200 text-center">
                  {item.quantity}
                </td>

                <td className="border p-2 border-gray-200 text-center">
                  Rs {item.price.toFixed(2)}
                </td>

                <td className="border p-2 border-gray-200 text-center">
                  Rs {(item.total || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BILLING */}
      <ReportSection title="Payment Summary">
        <ReportRow
          label="Subtotal"
          value={`Rs ${order.subtotal.toFixed(2)}`}
        />

        <ReportRow
          label="Tax"
          value={`Rs ${order.tax.toFixed(2)}`}
        />

        <ReportRow
          label="Discount"
          value={`Rs ${(order.discount || 0).toFixed(2)}`}
        />

        <ReportRow
          label="Service Charge"
          value={`Rs ${(order.serviceCharge || 0).toFixed(2)}`}
        />

        <ReportRow
          label="Grand Total"
          value={`Rs ${order.total.toFixed(2)}`}
        />
      </ReportSection>

      {/* NOTES */}
      <ReportSection title="Order Notes">
        <div className="p-3">
          {order.notes?.trim()
            ? order.notes
            : "No notes provided"}
        </div>
      </ReportSection>

      {/* FOOTER */}
      <div className="mt-10 border-t border-gray-300 pt-5 text-center text-sm text-gray-600">
        Generated on{" "}
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-2xl font-bold text-orange-600 uppercase">
        {title}
      </h2>

      <div className="border border-gray-300">
        {children}
      </div>
    </section>
  );
}

function ReportRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[250px_1fr] border-b border-gray-300 last:border-b-0">
      <div className="bg-orange-50 p-3 font-semibold">
        {label}
      </div>

      <div className="p-3">
        {value || "-"}
      </div>
    </div>
  );
}