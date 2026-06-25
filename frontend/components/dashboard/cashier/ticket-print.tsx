"use client";

import { TTicket } from "@/lib/types/ticket.types";

export default function OrderTicketPrint({ order }: { order: TTicket }) {
  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div
        className="bg-white text-black p-3 font-mono text-[12px]"
        style={{ width: "80mm" }}
      >
        {/* HEADER */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-[16px] tracking-wide">Local Vibes</h2>
          <p className="text-[11px] text-gray-600">Kitchen Order Slip</p>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* TICKET INFO */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Ticket</span>
            <span className="font-semibold">#{order.ticketNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Order</span>
            <span>{order?.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Table</span>
            <span>{order.table?.tableName || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span>Customer</span>
            <span>{order.order?.customerName || "Guest"}</span>
          </div>

          <div className="flex justify-between">
            <span>Waiter</span>
            <span>{order.waiter?.name || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span>Time</span>
            <span>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        <div className="font-bold text-center mb-1">ITEMS</div>

        <div className="space-y-1">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="max-w-[60%]">
                <span className="font-medium">{item.name}</span>
              </div>

              <div className="font-bold">x{item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        <div className="text-center text-[10px] text-gray-600">
          Thank you — Kitchen Copy
        </div>
      </div>
      <div
        className="bg-white text-black p-3 font-mono text-[12px]"
        style={{ width: "80mm" }}
      >
        {/* HEADER */}
        <div className="text-center mb-2">
          <h2 className="font-bold text-[16px] tracking-wide">Local Vibes</h2>
          <p className="text-[11px] text-gray-600">Kitchen Order Slip</p>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        {/* TICKET INFO */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Ticket</span>
            <span className="font-semibold">#{order.ticketNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Order</span>
            <span>{order?.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Table</span>
            <span>{order.table?.tableName || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span>Customer</span>
            <span>{order.order?.customerName || "Guest"}</span>
          </div>

          <div className="flex justify-between">
            <span>Waiter</span>
            <span>{order.waiter?.name || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span>Time</span>
            <span>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        <div className="font-bold text-center mb-1">ITEMS</div>

        <div className="space-y-1">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="max-w-[60%]">
                <span className="font-medium">{item.name}</span>
              </div>

              <div className="font-bold">x{item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-2" />

        <div className="text-center text-[10px] text-gray-600">
          Thank you — Kitchen Copy
        </div>
      </div>
    </div>
  );
}
