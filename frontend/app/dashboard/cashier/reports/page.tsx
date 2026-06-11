'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order, PaymentMethod, PaymentStatus } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const paymentStatusOptions: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
];

const paymentMethodOptions: { value: PaymentMethod | 'all'; label: string }[] = [
  { value: 'all', label: 'All methods' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'split', label: 'Split' },
];

const formatDate = (date: Date | undefined) => date ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-';

function createCsvData(orders: Order[]) {
  const headers = ['Order #', 'Table', 'Server', 'Total', 'Payment status', 'Payment method', 'Completed at'];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.table.number.toString(),
    order.waiter.name,
    order.total.toFixed(2),
    order.paymentStatus,
    order.paymentMethod || 'N/A',
    formatDate(order.completedAt || order.createdAt),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

function buildInvoiceText(order: Order) {
  const lines = [
    'DineFlow POS - Checkout Invoice',
    '----------------------------------------',
    `Order: ${order.orderNumber}`,
    `Table: ${order.table.number}`,
    `Server: ${order.waiter.name}`,
    `Date: ${formatDate(order.completedAt || order.createdAt)}`,
    '----------------------------------------',
    'Items:',
    ...order.items.map((item) => `  ${item.quantity} x ${item.menuItem.name} - $${(item.price * item.quantity).toFixed(2)}`),
    '----------------------------------------',
    `Subtotal: $${order.subtotal.toFixed(2)}`,
    `Tax: $${order.tax.toFixed(2)}`,
    `Total: $${order.total.toFixed(2)}`,
    `Payment status: ${order.paymentStatus}`,
    `Payment method: ${order.paymentMethod || 'N/A'}`,
    '----------------------------------------',
    'Thank you for dining with us!',
  ];
  return lines.join('\n');
}

export default function CashierReportsPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: completedOrders = [] } = useQuery({ queryKey: ['completed-orders'], queryFn: api.getCompletedOrders });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');

  const filteredOrders = useMemo(() => {
    return completedOrders.filter((order) => {
      const matchesSearch = searchTerm.trim().length === 0 ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.number.toString().includes(searchTerm) ||
        order.waiter.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
      const matchesMethod = methodFilter === 'all' || order.paymentMethod === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [completedOrders, searchTerm, statusFilter, methodFilter]);

  const downloadReportCsv = () => {
    const csv = createCsvData(filteredOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cashier-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadInvoice = (order: Order) => {
    const text = buildInvoiceText(order);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderNumber.replace('#', '')}-invoice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Cashier Reports" description="Browse completed checkout records, search by order, and export invoices or full reports." />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Report filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <Input
                placeholder="Order #, table, server"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Payment status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Payment method</label>
              <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | 'all')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full" onClick={downloadReportCsv}>
                Export full report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total records</p>
                <p className="font-semibold text-foreground">{filteredOrders.length}</p>
              </div>
              <Badge className="bg-primary/20 text-primary">Showing</Badge>
            </div>
            <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
              Refine the list by search, payment status, or method to locate invoices faster.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Checkout records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.table.number}</TableCell>
                  <TableCell>{/* @ts-ignore */}{(order as any).customerName || '-'}</TableCell>
                  <TableCell>{order.waiter.name}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={order.paymentStatus === 'paid' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.paymentMethod || 'N/A'}</TableCell>
                  <TableCell>{formatDate(order.completedAt || order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => downloadInvoice(order)}>
                        Invoice
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="p-6 text-center text-muted-foreground">
                    No records found.
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
              <DialogDescription>Complete checkout details</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>Customer: {/* @ts-ignore */}{(selectedOrder as any).customerName || '-'}</div>
              <div>Table: {selectedOrder.table.number}</div>
              <div>Server: {selectedOrder.waiter.name}</div>
              <div>Status: {selectedOrder.paymentStatus}</div>

              <div>
                <h4 className="font-semibold">Items</h4>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map(it => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{it.menuItem.name} x{it.quantity}</div>
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
