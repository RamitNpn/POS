export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-white text-2xl font-bold">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {["Revenue Growth", "Order Trends", "Profit Margin"].map((title) => (
          <div
            key={title}
            className="bg-[#141414] border border-white/10 p-5 rounded-xl"
          >
            <h2 className="text-white mb-3">{title}</h2>

            <div className="h-40 flex items-end gap-2">
              {[30, 50, 70, 40, 90].map((h, i) => (
                <div
                  key={i}
                  className="bg-yellow-400/40 w-full rounded"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}