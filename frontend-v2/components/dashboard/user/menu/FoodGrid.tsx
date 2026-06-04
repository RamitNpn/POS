import { MenuItem } from "@/libs/types/menu/MenuItem";
import FoodCard from "./FoodCard";

export default function FoodGrid({
  items,
  onAdd,
  onRemove,
}: {
  items: MenuItem[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-3 sm:gap-4
        p-2 sm:p-4
      "
    >
      {items.map((item) => (
        <FoodCard
          key={item.id}
          item={item}
          onAdd={() => onAdd(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}