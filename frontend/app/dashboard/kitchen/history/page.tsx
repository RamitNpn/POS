'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/lib/types';

export default function KitchenHistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], refetch, isFetching } = useQuery<Order[]>({
    queryKey: ['kitchen-history'],
    queryFn: api.getCompletedOrders,
  });

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        const term = search.trim().toLowerCase();
        if (!term) return true;

        return (
          order.orderNumber.toLowerCase().includes(term) ||
          order.table.number.toString().includes(term) ||
          order.waiter.name.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term)
        );
      }),
    [orders, search],
  );

  const visible = useMemo(() => {
    return filteredOrders.filter(o => statusFilter === 'all' || o.status === statusFilter);
  }, [filteredOrders, statusFilter]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kitchen Order History"
        description="Review completed kitchen orders and track fulfillment details."
      >
        <Button
          variant="outline"
          className="touch-target"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Search by order number, table, waiter, or status.
              </p>
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search kitchen history"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Filter status</label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="preparing">preparing</SelectItem>
                  <SelectItem value="ready">ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                {visible.length} orders
              </span>
            </div> */}
          </div>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length > 0 ? (
                visible.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.table.number}</TableCell>
                    <TableCell>{order.waiter.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {order.status}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.completedAt
                        ? order.completedAt.toLocaleString()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center text-sm text-muted-foreground">
                    No completed kitchen orders match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>Complete details for this order</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid gap-2">
                <div>Table: {selectedOrder.table.number}</div>
                <div>Server: {selectedOrder.waiter.name}</div>
                {/** @ts-ignore */}
                {selectedOrder.customerName && <div>Customer: {selectedOrder.customerName}</div>}
                <div>Status: {selectedOrder.status}</div>
                <div>Notes: {selectedOrder.notes || '—'}</div>
              </div>

              <div>
                <h4 className="font-semibold">Items</h4>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map(it => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{it.menuItem.name} x{it.quantity}</div>
                        {it.notes && <div className="text-sm text-muted-foreground">{it.notes}</div>}
                      </div>
                      <div className="text-foreground">${(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between"><span>Subtotal</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${selectedOrder.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-foreground"><span>Total</span><span>${selectedOrder.total.toFixed(2)}</span></div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
