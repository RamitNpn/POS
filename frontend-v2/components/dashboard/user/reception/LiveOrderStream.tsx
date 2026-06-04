"use client";

import { useMockLiveOrders } from "./MockLiveOrder";

export default function LiveOrderStream({ onSelect }: any) {
  const { orders } = useMockLiveOrders();

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelect(order)}
          className={`cursor-pointer bg-[#1c1c1c] border rounded-xl p-4 transition-all duration-300
            ${
              order.isNew
                ? "border-yellow-400 animate-pulse"
                : "border-[#2a2a2a]"
            }
          `}
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{order.customer}</p>
              <p className="text-xs text-gray-400">{order.table}</p>
            </div>

            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
              Ready
            </span>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            {order.items.length} items
          </div>
        </div>
      ))}
    </div>
  );
}