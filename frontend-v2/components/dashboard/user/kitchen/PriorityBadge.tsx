import React from "react";

export default function PriorityBadge({
  priority,
}: {
  priority?: string;
}) {
  if (priority === "high")
    return <span className="text-red-400 text-xs">🔥 High</span>;

  if (priority === "normal")
    return <span className="text-yellow-400 text-xs">⚡ Normal</span>;

  return <span className="text-gray-500 text-xs">Low</span>;
}