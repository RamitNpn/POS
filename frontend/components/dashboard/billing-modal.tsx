"use client";

export default function PrintInvoice({ order }: any) {

  if (!order) return null;

  const paymentLabel =
    order.paymentMethod === "mobile"
      ? "Mobile Payment"
      : order.paymentMethod === "card"
        ? "Card"
        : order.paymentMethod === "cash"
          ? "Cash"
          : order.paymentMethod === "split"
            ? "Split Payment"
            : "Unknown";

  return (
    <div className="hidden print:block">
      <div className="receipt-print w-[80mm] bg-white text-black px-3 py-2 text-xs font-sans m-[10px] border border-dashed border-gray-600 rounded">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between text-[10px]">
            <span>Estd: 2068/2/21</span>
            <span>PAN: 123S34Ft-V21</span>
          </div>
          <h1 className="text-xl font-bold tracking-wider">Local Vibes</h1>
          <p className="text-[10px] text-gray-600">
            Butwal 10, Kalikanagar
          </p>
        </div>

        {/* Invoice Info */}
        <div className="py-2 border-b border-gray-200">
          <div className="flex justify-between">
            <span>Invoice</span>
            <span>{order.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Order</span>
            <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Checkout</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Order Info */}
        <div className="py-2 border-b border-gray-200">
          <div className="flex justify-between">
            <span>Table</span>
            <span>{order.table?.name}</span>
          </div>

          <div className="flex justify-between">
            <span>Waiter</span>
            <span>{order.waiter?.name}</span>
          </div>

          <div className="flex justify-between">
            <span>Method</span>
            <span>{paymentLabel}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="capitalize">{order.paymentStatus}</span>
          </div>
        </div>

        {/* Items Header */}
        <div className="py-2">
          <div className="grid grid-cols-12 bg-gray-200 text-gray-950 p-1">
            <span className="col-span-5">Item</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Rate</span>
            <span className="col-span-3 text-right">Amt</span>
          </div>

          {order.items?.map((item: any) => (
            <div key={item._id} className="grid grid-cols-12 py-1">
              <span className="col-span-5 truncate">{item.menuItem?.name}</span>

              <span className="col-span-2 text-center">{item.quantity}</span>

              <span className="col-span-2 text-right">
                {item.price.toFixed(2)}
              </span>

              <span className="col-span-3 text-right">
                {(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-b border-gray-200 py-2 mt-1">
          <div className="flex justify-between text-[13px]">
            <span>Subtotal</span>
            <span>Rs. {order.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-[13px]">
            <span>Tax</span>
            <span>Rs. {order.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-[14px] text-base mt-1">
            <span>TOTAL</span>
            <span>Rs. {order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 space-y-1">
          <p className="font-semibold">Thank You For Visiting!</p>

          <p className="text-[10px] text-gray-600">Please Visit Again</p>

          <div className="border-t border-gray-200 mt-2 pt-2 text-[9px]">
            Powered by DineFlow
          </div>
        </div>
      </div>
    </div>
  );
}
