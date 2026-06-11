'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Button } from '@/components/ui/button';
import { OrderCard, OrderList } from '@/components/dashboard/order-card';
import { api } from '@/lib/api/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order, OrderStatus } from '@/lib/types';

const orderStatusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function WaiterOrdersPage() {
  const { data: activeOrders, refetch: refetchActive } = useQuery({
    queryKey: ['active-orders'],
    queryFn: api.getActiveOrders,
  });

  const { data: completedOrders, refetch: refetchCompleted } = useQuery({
    queryKey: ['completed-orders'],
    queryFn: api.getCompletedOrders,
  });

  const waiterIds = ['2', '5'];
  const waiterOrders = activeOrders?.filter(
    (order) => waiterIds.includes(order.waiterId) && order.status !== 'served',
  ) ?? [];

  const waiterServedOrders = activeOrders?.filter(
    (order) => waiterIds.includes(order.waiterId) && order.status === 'served',
  ) ?? [];

  const waiterHistory = [
    ...(completedOrders?.filter((order) => waiterIds.includes(order.waiterId)) ?? []),
    ...waiterServedOrders,
  ];

  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const filteredWaiterOrders = waiterOrders.filter(
    (order) => orderStatusFilter === 'all' || order.status === orderStatusFilter,
  );

  const handleMarkServed = async (order: Order) => {
    await api.updateOrderStatus(order.id, 'served');
    refetchActive();
    refetchCompleted();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Orders"
        description="View the waiter order queue and completed history."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">Active orders filter</h2>
          <p className="text-sm text-muted-foreground">Filter waiter orders by status.</p>
        </div>
        <div className="w-full max-w-xs">
          <Select value={orderStatusFilter} onValueChange={(value) => setOrderStatusFilter(value as OrderStatus | 'all')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {orderStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card border-border rounded-xl">
          <div className="border-b border-border px-4 py-4">
            <h3 className="text-sm font-semibold text-foreground">Active Orders</h3>
          </div>
          <div className="p-4 space-y-3">
            {filteredWaiterOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active waiter orders</p>
            ) : (
              <div className="space-y-3">
                {filteredWaiterOrders.map((order) => (
                  <div key={order.id} className="space-y-2">
                    <OrderCard order={order} compact />
                    {order.status === 'ready' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMarkServed(order)}
                      >
                        Mark served
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderList
        orders={waiterHistory}
        title="Completed Orders"
        emptyMessage="No completed orders yet"
      />
    </div>
  );
}
