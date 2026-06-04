import { Order, OrderStatus } from "@/libs/types/kitchen/order.types";
import KitchenCard from "./KitchenCard";

export default function KitchenColumn({
  title,
  orders,
  color,
  onAction,
}: {
  title: string;
  orders: Order[];
  color: string;
  onAction?: (id: string, status: OrderStatus) => void;
}) {
  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-3">
      <h2 className={`font-bold mb-3 ${color}`}>
        {title} ({orders.length})
      </h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <KitchenCard
            key={order.id}
            order={order}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}