'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { KitchenDisplay } from '@/components/dashboard/kitchen-display';
import { StatsCard } from '@/components/dashboard/stats-card';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChefHat, Clock, AlertTriangle } from 'lucide-react';
import type { Order, OrderItem } from '@/lib/types';
import Link from 'next/link';

export default function KitchenDashboard() {
  const { data: orders, refetch, isRefetching } = useQuery({
    queryKey: ['kitchen-orders'],
    queryFn: api.getKitchenOrders,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const handleMarkReady = (order: Order) => {
    // In a real app, this would update the order status via API
    console.log('[v0] Mark order ready:', order.id);
  };

  const handleMarkItemReady = (order: Order, item: OrderItem) => {
    // In a real app, this would update the item status via API
    console.log('[v0] Mark item ready:', order.id, item.id);
  };

  const handleChangeItemStatus = (order: Order, item: OrderItem, status: Order['status']) => {
    console.log('[v0] Change item status:', order.id, item.id, status);
    // TODO: call API to update item status and refetch
  };

  const handleChangeOrderStatus = (order: Order, status: Order['status']) => {
    console.log('[v0] Change order status:', order.orderNumber, status);
    // TODO: call API to update order status and refetch
  };

  const pendingCount = orders?.filter(o => o.status === 'pending').length || 0;
  const preparingCount = orders?.filter(o => o.status === 'preparing').length || 0;
  const readyCount = orders?.filter(o => o.status === 'ready').length || 0;

  // Calculate priority orders (older than 20 minutes)
  const priorityCount = orders?.filter(o => {
    const age = (Date.now() - o.createdAt.getTime()) / (1000 * 60);
    return age > 20 && o.status !== 'ready';
  }).length || 0;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kitchen Display"
        description="Manage and track incoming orders"
      >
        <div className="flex items-center gap-2"> 
          <Button 
            variant="outline" 
            className="touch-target"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`size-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </DashboardHeader>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
        <StatsCard
          title="Pending Orders"
          value={pendingCount}
          icon={<Clock className="size-4" />}
        />
        <StatsCard
          title="Preparing"
          value={preparingCount}
          icon={<ChefHat className="size-4" />}
        />
        <StatsCard
          title="Ready"
          value={readyCount}
          icon={<ChefHat className="size-4" />}
        />
        <StatsCard
          title="Priority (>20min)"
          value={priorityCount}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      {/* Kitchen Orders Display */}
      {orders && (
        <KitchenDisplay
          orders={orders}
          onMarkReady={handleMarkReady}
          onMarkItemReady={handleMarkItemReady}
          onChangeItemStatus={handleChangeItemStatus}
          onChangeOrderStatus={handleChangeOrderStatus}
        />
      )}
    </div>
  );
}
