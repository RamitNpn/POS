"use client";

import BillingStats from "@/components/dashboard/admin/billing/BillingStats";
import BillingTabs from "@/components/dashboard/admin/billing/BillingTabs";

export default function BillingPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Billing & Invoices
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Manage invoices, revenue reports & financial logs
        </p>
      </div>

      <BillingStats />

      <BillingTabs />

    </div>
  );
}