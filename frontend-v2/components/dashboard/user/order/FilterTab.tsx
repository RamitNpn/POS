"use client";

import { useState } from "react";

const tabs = [
  "All",
  "In Progress",
  "Ready",
  "Completed",
];

export default function FilterTabs() {
  const [active, setActive] =
    useState("All");

  return (
    <div
      className="
        flex
        bg-zinc-900/50
        rounded-xl
        p-1
      "
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`
            px-6
            py-2
            text-sm
            rounded-lg
            transition-all

            ${
              active === tab
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}