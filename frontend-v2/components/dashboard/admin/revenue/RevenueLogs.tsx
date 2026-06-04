const logs = [
  "Salary expense recorded",
  "Food sales income added",
  "Monthly revenue report generated",
];

export default function RevenueLogs() {
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