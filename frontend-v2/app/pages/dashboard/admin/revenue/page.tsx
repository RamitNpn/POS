"use client";

import RevenueStats from "@/components/dashboard/admin/revenue/RevenueStats";
import RevenueTabs from "@/components/dashboard/admin/revenue/RevenueTabs";

export default function RevenuePage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Revenue Management
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Track income, expenses, profit & financial reports
        </p>
      </div>

      <RevenueStats />
      <RevenueTabs />

    </div>
  );
}