"use client";

import InvoiceModal from "@/components/dashboard/user/reception/InvoiceModal";
import OrderList from "@/components/dashboard/user/reception/OrderList";
import { useState } from "react";

export default function ReceptionDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <>
      <main className="px-4 md:px-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold">Billing & Invoices</h1>

        <OrderList onSelectOrder={setSelectedOrder} />
      </main>

      <InvoiceModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
