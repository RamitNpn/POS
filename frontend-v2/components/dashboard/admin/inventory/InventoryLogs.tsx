const logs = [
  "Wagyu Steak stock updated",
  "New category 'Grill' added",
  "Truffle Pasta marked low stock",
];

export default function InventoryLogs() {
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