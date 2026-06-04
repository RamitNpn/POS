import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  percentage,
  description,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className="
      bg-[#1a1a1a]
      border
      border-[#2a2a2a]
      p-6
      rounded-2xl
    "
    >

      <div className="flex justify-between items-start mb-4">

        <h3 className="text-gray-400 font-medium">
          {title}
        </h3>

        <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>

      </div>

      <div className="space-y-1">

        <p className="text-4xl font-bold">
          {value}
        </p>

        <p className="text-green-500 text-sm font-medium">

          <span className="font-bold">
            {percentage}
          </span>{" "}
          {description}

        </p>

      </div>

    </div>
  );
}