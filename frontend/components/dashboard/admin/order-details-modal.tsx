"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TOrder } from "@/lib/types/order.types";
import OrderPrintReport from "./order-print-report";

interface Props {
  open: boolean;
  onClose: () => void;
  order: TOrder | null;
}

export default function OrderDetailsModal({ open, onClose, order }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: order?.orderNumber,
  });

  if (!order) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-7xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{order.orderNumber}</DialogTitle>
            </div>
          </DialogHeader>

          <div
            className="space-y-6 print:bg-white print:text-black print:p-8 print:m-2"
          >
            {/* HEADER */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold">Order Details</h2>

              <p className="text-gray-300">{order.orderNumber}</p>
            </div>

            {/* ORDER INFO */}
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Order ID" value={order._id} />
              <Info label="Order Number" value={order.orderNumber} />
              <Info label="Status" value={order.status} />
              <Info label="Payment Status" value={order.paymentStatus} />
              <Info label="Ticket Count" value={String(order.ticketCount)} />
              <Info
                label="Created At"
                value={new Date(order.createdAt).toLocaleString()}
              />
              <Info
                label="Updated At"
                value={new Date(order.updatedAt).toLocaleString()}
              />
            </div>

            {/* TABLE */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Table Information</h3>

              <div className="grid gap-3 md:grid-cols-3">
                <Info label="Table Name" value={order.table?.name} />

                <Info label="Capacity" value={String(order.table?.capacity)} />

                <Info label="Table Status" value={order.table?.status} />
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Customer Information</h3>

              <Info
                label="Customer Name"
                value={order.customerName || "Guest"}
              />
            </div>

            {/* WAITER */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Waiter Information</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Name" value={order.waiter?.name} />

                <Info label="Email" value={order.waiter?.email} />

                <Info label="Phone" value={order.waiter?.phone} />

                <Info label="Role" value={order.waiter?.role} />

                <Info label="Status" value={order.waiter?.status} />
              </div>
            </div>

            {/* ITEMS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Order Items</h3>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.menuItem}</td>

                      <td className="text-center">{item.quantity}</td>

                      <td className="text-right">Rs {item.price.toFixed(2)}</td>

                      <td className="text-right font-medium">
                        Rs {item?.total?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BILLING */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Billing Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rs {order.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>{order.discount || "0"}%</span>
                </div>

                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>Rs {order.serviceCharge?.toFixed(2) || "0.00"}</span>
                </div>

                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* NOTES */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Notes</h3>

              <p className="text-gray-300">
                {order.notes?.trim() ? order.notes : "No notes provided"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="hidden">
        <div ref={printRef}>
          <OrderPrintReport order={order} />
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
