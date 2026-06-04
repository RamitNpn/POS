export default function OrderCard({ order, onClick }: any) {
  const total = order.items.reduce(
    (sum: number, i: any) => sum + i.qty * i.price,
    0
  );

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 hover:border-yellow-400 transition"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{order.customer}</h3>
          <p className="text-xs text-gray-400">{order.table}</p>
        </div>

        <span className="text-xs bg-green-500/10 text-green-400 px-2 pt-1 h-6 rounded">
          Ready
        </span>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        {order.items.length} Items
      </div>

      <div className="mt-2 font-bold text-yellow-400">
        ₹ {total}
      </div>
    </div>
  );
}