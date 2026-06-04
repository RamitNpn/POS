export default function FloatingRevenue() {
  return (
    <div className="w-64 p-5 bg-[#1f1f1f]/80 border border-[#333] rounded-xl backdrop-blur-xl shadow-xl animate-[float_6s_ease-in-out_infinite]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-yellow-400">💰</span>
        <span className="text-xs text-green-400">+12.5%</span>
      </div>

      <p className="text-gray-400 text-xs uppercase">Total Revenue</p>
      <h2 className="text-white text-xl font-bold mt-1">$42,920</h2>
    </div>
  );
}