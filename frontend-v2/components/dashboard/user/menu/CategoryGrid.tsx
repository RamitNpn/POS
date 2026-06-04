const categories = [
  { name: "Starters", color: "bg-red-700/70", quantity: 1, icon: "🍲" },
  { name: "Main Course", color: "bg-indigo-700/70", quantity: 1, icon: "🍛" },
  { name: "Beverages", color: "bg-purple-700/70", quantity: 1, icon: "🍹" },
  { name: "Desserts", color: "bg-blue-700/70", quantity: 1, icon: "🍰" },
  { name: "Pizza", color: "bg-green-700/70", quantity: 1, icon: "🍕" },
];

export default function CategoryGrid({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-3
        p-2 sm:p-4
      "
    >
      {categories.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name)}
          className={`
            p-3 sm:p-4
            rounded-xl
            text-left
            transition
            active:scale-[0.98]
            touch-manipulation
            ${active === c.name ? "ring-2 ring-yellow-400" : ""}
            ${c.color}
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg sm:text-xl">{c.icon}</div>
            <p className="font-semibold text-sm sm:text-base">
              {c.name}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-400">
            {c.quantity} items
          </p>
        </button>
      ))}
    </div>
  );
}