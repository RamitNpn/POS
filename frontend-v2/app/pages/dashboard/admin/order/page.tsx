"use client";

import OrderTabs from "@/components/dashboard/admin/order/OrderTabs";
import StatsCards from "@/components/dashboard/admin/order/StatsCard";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Orders Management</h1>

        <p className="text-sm text-zinc-400 mt-2">
          Manage restaurant orders, analytics, and operational logs.
        </p>
      </div>

      <StatsCards />

      {/* <OrderBoard /> */}

      <OrderTabs />
    </div>
  );
}
