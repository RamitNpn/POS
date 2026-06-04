import { MenuItem } from "@/libs/types/menu/MenuItem";
import { ShoppingBag } from "lucide-react";

export default function FoodCard({
  item,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        bg-[#1f1f1f]
        p-3 sm:p-4
        rounded-xl
        flex flex-col
        gap-2
        hover:scale-[1.01]
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-32 sm:h-36 md:h-40 overflow-hidden rounded-lg">
        <img
          src={item.image || ""}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3 sm:gap-4">
        
        {/* TITLE */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-sm sm:text-base leading-tight">
            {item.name}
          </h3>

          <span className="text-green-400">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>

        {/* PRICE + QUANTITY */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm sm:text-base">
            ₹{item.price}
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            
            <button
              onClick={onRemove}
              className="
                px-2 sm:px-3
                py-1
                bg-black
                rounded
                text-sm
                active:scale-95
              "
            >
              -
            </button>

            <span className="text-sm sm:text-base min-w-5 text-center">
              {item.qty || 0}
            </span>

            <button
              onClick={onAdd}
              className="
                px-2 sm:px-3
                py-1
                bg-black
                rounded
                text-sm
                active:scale-95
              "
            >
              +
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}