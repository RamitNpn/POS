import { CheckCircle2 } from "lucide-react";

interface OrderCardProps {
  customer: string;
  orderId: string;
  type: string;
  status: string;
  statusText: string;
  items: number;
  amount: number;
  date: string;
}

export default function OrderCard({
  customer,
  orderId,
  type,
  status,
  statusText,
  items,
  amount,
  date,
}: OrderCardProps) {
  return (
    <div
      className="
        bg-[#262626]
        rounded-2xl
        p-6
        border
        border-transparent
        hover:border-yellow-400
        transition-all
        duration-300
      "
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div
            className="
              w-12
              h-12
              rounded-lg
              bg-yellow-400
              flex
              items-center
              justify-center
              text-black
              text-lg
              font-bold
            "
          >
            AM
          </div>

          <div>
            <h3 className="font-bold">{customer}</h3>

            <p className="text-xs text-zinc-400">
              #{orderId} / {type}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className="
              inline-flex
              items-center
              gap-2
              bg-green-500/10
              text-green-500
              rounded-md
              px-2
              py-1
              mb-2
            "
          >
            <CheckCircle2 size={14} />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
              "
            >
              {status}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              justify-end
              gap-2
              text-xs
              text-zinc-400
            "
          >
            <span
              className="
                w-2
                h-2
                rounded-full
                bg-green-500
              "
            />

            {statusText}
          </div>
        </div>
      </div>

      <div
        className="
          flex
          justify-between
          items-center
          text-xs
          text-zinc-400
          mb-4
        "
      >
        <span>{date}</span>

        <span className="font-medium">{items} Items</span>
      </div>

      <div
        className="
          border-t
          border-[#333333]
          pt-4
          flex
          justify-between
          items-center
        "
      >
        <span className="text-lg font-medium">Total</span>

        <span className="text-xl font-bold">₹{amount.toFixed(2)}</span>
      </div>
    </div>
  );
}
