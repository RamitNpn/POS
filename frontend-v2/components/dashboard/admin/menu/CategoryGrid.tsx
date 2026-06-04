"use client";

const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
  "Seafood",
  "Grill",
  "Vegetarian",
  "Specials",
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {categories.map((cat) => (
        <div
          key={cat}
          className="bg-[#141414] border border-white/10 p-4 rounded-xl hover:border-yellow-500/40 transition"
        >
          <h3 className="text-white font-semibold">{cat}</h3>
          <p className="text-xs text-zinc-400 mt-1">
            View & manage items
          </p>
        </div>
      ))}

    </div>
  );
}