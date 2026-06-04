export type TableFilter = "all" | "booked" | "available";

export default function FilterTabs({
  active,
  onChange,
}: {
  active: TableFilter;
  onChange: (value: TableFilter) => void;
}) {
  const tabs: TableFilter[] = ["all", "booked", "available"];

  return (
    <div className="flex bg-[#262626] rounded-lg p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            px-5 py-1.5 text-sm rounded-md capitalize transition
            ${
              active === tab
                ? "bg-[#3f3f3f] text-white"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}