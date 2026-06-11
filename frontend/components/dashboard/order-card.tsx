import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  compact?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' },
  preparing: { label: 'Preparing', className: 'bg-info/20 text-info border-info/30' },
  ready: { label: 'Ready', className: 'bg-success/20 text-success border-success/30' },
  served: { label: 'Served', className: 'bg-primary/20 text-primary border-primary/30' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-muted' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export function OrderCard({ order, compact = false, onClick }: OrderCardProps) {
  const status = statusConfig[order.status];
  const timeAgo = formatDistanceToNow(order.createdAt, { addSuffix: true });

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border border-border bg-card/50 p-3 transition-colors',
          onClick && 'cursor-pointer hover:bg-accent/50'
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-sm font-bold">
            {order.table.number}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
            <p className="md:text-sm text-[10px] text-muted-foreground">{timeAgo}</p>
            {/** @ts-ignore */}
            {(order as any).customerName && (
              <p className="text-[10px] text-muted-foreground">Customer: {(order as any).customerName}</p>
            )}
          </div>
        </div>
        <div className="md:flex md:items-center grid grid-cols-1 gap-1 md:gap-2">
          <span className="text-[12px] md:text-sm font-medium text-foreground">Rs {order.total.toFixed(2)}</span>
          <Badge variant="outline" className={cn('md:text-sm text-[10px]', status.className)}>
            {status.label}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('bg-card border-border', onClick && 'cursor-pointer hover:border-primary/50 transition-colors')} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-lg font-bold">
            {order.table.number}
          </div>
          <div>
            <CardTitle className="text-base text-foreground">{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">Table {order.table.number} - {order.table.section}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn('text-xs', status.className)}>
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {order.items.length} items - {timeAgo}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Server: {order.waiter.name}</span>
            <span className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrderListProps {
  orders: Order[];
  title?: string;
  emptyMessage?: string;
  onOrderClick?: (order: Order) => void;
}

export function OrderList({ orders, title, emptyMessage = 'No orders found', onOrderClick }: OrderListProps) {
  return (
    <Card className="bg-card border-border">
      {title && (
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? '' : 'pt-6'}>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                compact 
                onClick={onOrderClick ? () => onOrderClick(order) : undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
