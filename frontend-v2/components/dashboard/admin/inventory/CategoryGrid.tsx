const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
  "Seafood",
  "Grill",
];

export default function InventoryCategoryGrid() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c}
            className="bg-[#141414] border border-white/10 p-4 rounded-xl hover:border-yellow-500/40"
          >
            <h3 className="text-white font-semibold">{c}</h3>
            <p className="text-zinc-400 text-xs mt-1">Manage items in {c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
