export default function FloatingAnalytics() {
  return (
    <div className="w-80 p-5 bg-[#1f1f1f]/80 border border-[#333] rounded-xl backdrop-blur-xl shadow-xl animate-[float_10s_ease-in-out_infinite]">
      <div className="flex justify-between mb-4">
        <p className="text-white text-sm">Peak Performance</p>
        <span className="text-gray-400">⋯</span>
      </div>

      <p className="text-gray-400 text-xs mb-2">Efficiency</p>

      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="w-[98%] h-full bg-yellow-400" />
      </div>

      <p className="text-right text-yellow-400 text-sm mt-2">98%</p>
    </div>
  );
}