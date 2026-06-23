"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MetricCard,
  PageSection,
} from "@/components/dashboard/admin/shared";
import { TSalesItem, TTopSellingItems } from "@/lib/types/sales.types";
import { useTopSellingItems } from "@/hooks/admin/sales/getTopSellingItems";

export default function FoodAnalyticsPage() {

  const { data: itemResponse } = useTopSellingItems({});

  const itemData: TTopSellingItems | undefined = itemResponse;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Food Analytics"
        description="Track menu category performance and top selling dishes."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Top item" value={itemData?.topItem ?? "N/A"} />

        <MetricCard
          title="Top revenue"
          value={`Rs ${(itemData?.topRevenue ?? 0).toFixed(2)}`}
        />

        <MetricCard title="Item count" value={itemData?.totalItems ?? 0} />
      </div>
      <PageSection title="Top Selling Items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemData?.items?.map((item: TSalesItem) => (
              <TableRow key={item.menuItemId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>Rs {item.revenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
