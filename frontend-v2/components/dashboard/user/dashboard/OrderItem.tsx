import { Check } from "lucide-react";

interface OrderItemProps {
  name: string;
  items: number;
  table: number;
  status: string;
}

export default function OrderItem({
  name,
  items,
  table,
  status,
}: OrderItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <div
          className="
          w-10
          h-10
          rounded-lg
          bg-yellow-500
          flex
          items-center
          justify-center
          text-black
          font-bold
          text-xs
        "
        >
          AM
        </div>

        <div>
          <p className="font-semibold text-sm">{name}</p>

          <p className="text-xs text-gray-500">{items} Items</p>
        </div>
      </div>

      <div
        className="
        bg-[#2a2a2a]
        border
        border-yellow-500/20
        rounded
        px-3
        py-1
        text-xs
        text-yellow-500
      "
      >
        Table No: {table}
      </div>

      <div className="text-right space-y-1">
        <p
          className="
          text-green-500
          text-xs
          font-bold
          flex
          items-center
          justify-end
          gap-1
        "
        >
          <Check size={14} />

          {status}
        </p>

        <p
          className="
          text-gray-400
          text-xs
          flex
          items-center
          justify-end
          gap-2
        "
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Ready to serve
        </p>
      </div>
    </div>
  );
}
