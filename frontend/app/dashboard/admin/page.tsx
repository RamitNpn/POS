"use client";

"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OrderList } from "@/components/dashboard/order-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TableStats } from "@/components/dashboard/table-grid";
import { api } from "@/lib/api/mock-data";
import type {
  DashboardStats,
  RevenueData,
  Order,
  ActivityLog,
  Table,
} from "@/lib/types";
import { useTableStats } from "@/hooks/shared/stats/getTableStats";
import { useDashboardStats } from "@/hooks/shared/stats/getDashboardStats";
import { useRevenueChart } from "@/hooks/admin/analytics/getRevenueAnalytic";
import { useState } from "react";
import { KitchenOrderList } from "@/components/dashboard/kitchen-order-card";

export default function AdminDashboard() {
  const { data: dashboardStats } = useDashboardStats();
  const dashboard = dashboardStats?.data;

  const { data: tableStats } = useTableStats();
  const tableData = tableStats?.data;

  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "all">(
    "30d",
  );

  const { data: getRevenue } = useRevenueChart(period);
  const revenueData = getRevenue?.data;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your restaurant performance"
      ></DashboardHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={dashboard ? `Rs ${dashboard.totalRevenue}` : "-"}
          change={dashboard?.revenueChange}
          icon={<DollarSign className="size-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={dashboard?.totalOrders || "-"}
          change={dashboard?.ordersChange}
          icon={<ShoppingCart className="size-4" />}
        />
        <StatsCard
          title="Avg. Order Value"
          value={dashboard ? `Rs ${dashboard.averageOrderValue}` : "-"}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCard
          title="Active Orders"
          value={dashboard?.activeOrders || "-"}
          icon={<Users className="size-4" />}
        />
      </div>

      {/* Table Status */}
      {tableStats && <TableStats stats={tableData} />}

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart
            data={revenueData ?? []}
            period={period}
            setPeriod={setPeriod}
          />
        </div>
        <div className="lg:col-span-3">
           <ActivityFeed />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
          <KitchenOrderList
            title="Active Orders"
            emptyMessage="No active orders right now"
          />
          <OrderList
            title="Completed Order"
            emptyMessage="No orders today"
          />
      </div>
    </div>
  );
}
