const logs = [
  "Invoice INV001 paid successfully",
  "Invoice INV002 pending payment",
  "Daily revenue report generated",
];

export default function BillingLogs() {
  return (
    <div className="space-y-3 text-zinc-300">

      {logs.map((l, i) => (
        <div key={i} className="border-b border-white/10 pb-3">
          {l}
        </div>
      ))}

    </div>
  );
}