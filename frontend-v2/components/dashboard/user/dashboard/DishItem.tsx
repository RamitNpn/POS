import Image from "next/image";

interface DishItemProps {
  rank: number;
  name: string;
  orders: number;
  image: string;
}

export default function DishItem({
  rank,
  name,
  orders,
  image,
}: DishItemProps) {
  return (
    <div className="flex items-center gap-4">

      <span className="text-lg font-bold text-white w-6">
        {String(rank).padStart(2, "0")}
      </span>

      <div
        className="
        w-12
        h-12
        rounded-full
        overflow-hidden
        bg-gray-800
      "
      >

        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />

      </div>

      <div className="flex-1">

        <p className="text-sm font-bold">
          {name}
        </p>

        <p className="text-xs text-gray-500">
          Orders: {orders}
        </p>

      </div>

    </div>
  );
}