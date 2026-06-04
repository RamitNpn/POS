export default function OrderSidebar({
  items,
}: {
  items: { name: string; qty: number; price: number }[];
}) {
  const total = items.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <aside
      className="
        w-full
        lg:w-[380px]
        bg-[#1a1a1a]
        border-t lg:border-t-0 lg:border-l
        border-gray-800
        p-3 sm:p-4
        flex flex-col
        max-h-[50vh] lg:max-h-none
        rounded-md
      "
    >
      {/* HEADER */}
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
        Current Order
      </h2>

      {/* ITEMS LIST */}
      <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-1 pr-1">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No items added
          </p>
        ) : (
          items.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between text-xs sm:text-sm"
            >
              <span className="truncate pr-2">
                {i.name} x{i.qty}
              </span>
              <span className="shrink-0">
                ₹{i.qty * i.price}
              </span>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 sm:mt-6 border-t border-gray-700 pt-3">
        <div className="flex justify-between font-bold text-sm sm:text-base">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          className="
            w-full
            mt-3 sm:mt-4
            bg-yellow-400
            text-black
            py-2
            rounded
            text-sm sm:text-base
            font-semibold
            active:scale-95
            transition
          "
        >
          Place Order
        </button>
      </div>
    </aside>
  );
}