export default function PrintInvoice({ order, paymentMethod }: any) {
  const total = order.items.reduce(
    (sum: number, item: any) => sum + item.qty * item.price,
    0,
  );

  const paymentLabel =
    paymentMethod === "e-pay"
      ? "E-Payment"
      : paymentMethod === "e-banking"
        ? "E-Banking"
        : paymentMethod === "cash"
          ? "Cash"
          : "Other";

  return (
    <div className="w-[80mm] bg-white text-black p-3 text-xs font-sans m-[10px] border border-dashed border-gray-600 rounded">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-2">
        <h1 className="text-xl font-bold tracking-wider">DINEFLOW</h1>
        <p className="text-[10px] text-gray-600">
          Restaurant Management System
        </p>
      </div>

      {/* Invoice Info */}
      <div className="py-2 border-b border-gray-200">
        <div className="flex justify-between">
          <span>Invoice</span>
          <span>#{order.id || "000001"}</span>
        </div>

        <div className="flex justify-between">
          <span>Date</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Time</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Customer */}
      <div className="py-2 border-b border-gray-200">
        <div className="flex justify-between">
          <span>Customer</span>
          <span>{order.customer}</span>
        </div>

        <div className="flex justify-between">
          <span>Table</span>
          <span>{order.table}</span>
        </div>

        <div className="flex justify-between">
          <span>Method</span>
          <span>{paymentLabel}</span>
        </div>
      </div>

      {/* Item Header */}
      <div className="py-2">
        <div className="grid grid-cols-12 bg-gray-200 text-gray-950 p-1">
          <span className="col-span-5">Item</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-2 text-right">Rate</span>
          <span className="col-span-3 text-right">Amt</span>
        </div>

        {/* Items */}
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="grid grid-cols-12 py-1">
            <span className="col-span-5 truncate">{item.name}</span>

            <span className="col-span-2 text-center">{item.qty}</span>

            <span className="col-span-2 text-right">{item.price}</span>

            <span className="col-span-3 text-right">
              {item.qty * item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-b border-gray-200 py-2 mt-1">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between font-bold text-base mt-1">
          <span>TOTAL</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 space-y-1">
        <p className="font-semibold">Thank You For Visiting!</p>

        <p className="text-[10px] text-gray-[#151515]">Please Visit Again</p>

        <div className="border-t border-gray-200 mt-2 pt-2 text-[9px]">
          Powered by DineFlow
        </div>
      </div>
    </div>
  );
}
