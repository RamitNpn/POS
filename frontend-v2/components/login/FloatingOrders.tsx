export default function FloatingOrders() {
  return (
    <div className="w-72 p-5 bg-[#1f1f1f]/80 border border-[#333] rounded-xl backdrop-blur-xl shadow-xl animate-[float_8s_ease-in-out_infinite]">
      <div className="flex gap-3 items-center mb-4">
        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-400">
          🍽
        </div>
        <div>
          <p className="text-white text-sm">Active Orders</p>
          <p className="text-gray-400 text-xs">24 Tables Live</p>
        </div>
      </div>

      <div className="flex gap-1 h-10 items-end">
        <div className="flex-1 bg-yellow-500/20 h-4" />
        <div className="flex-1 bg-yellow-500/40 h-8" />
        <div className="flex-1 bg-yellow-500/60 h-6" />
        <div className="flex-1 bg-yellow-500 h-10" />
      </div>
    </div>
  );
}