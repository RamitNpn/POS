"use client";

import { CheckCircle, Flame } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import { Order, OrderStatus } from "@/libs/types/kitchen/order.types";

export default function KitchenCard({
  order,
  onAction,
}: {
  order: Order;
  onAction?: (id: string, status: OrderStatus) => void;
}) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-3 hover:border-yellow-500 transition">
      
      {/* TOP */}
      <div className="flex justify-between">
        <p className="font-semibold">{order.table}</p>
        <PriorityBadge priority={order.priority} />
      </div>

      <p className="text-xs text-gray-400">{order.customer}</p>

      {/* ITEMS */}
      <div className="mt-2 text-xs text-gray-300 space-y-1">
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{i.name}</span>
            <span>x{i.qty}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-gray-500 mt-2">{order.time}</p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {order.status !== "cooking" && (
          <button
            onClick={() => onAction?.(order.id, "cooking")}
            className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-400"
          >
            <Flame className="w-3 h-3 inline" /> Cook
          </button>
        )}

        {order.status !== "ready" && (
          <button
            onClick={() => onAction?.(order.id, "ready")}
            className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400"
          >
            <CheckCircle className="w-3 h-3 inline" /> Ready
          </button>
        )}
      </div>
    </div>
  );
}