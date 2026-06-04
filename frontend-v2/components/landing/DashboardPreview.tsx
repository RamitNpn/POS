"use client";

import { useState } from "react";

type TabType = "owner" | "kitchen" | "pos";

export default function RoleDashboardSection() {
  const [tab, setTab] = useState<TabType>("owner");

  const images: Record<TabType, string> = {
    owner:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6kQFvFQgzt0fSobkB68aqA3Sva9YruWuFfat8onZ4RI_HMW_hSOwY3hpvYpvrHYrGzX4u7yNdRM5nYg2RRFc_4NDayxQA8h4UYCsibXEBFuLhb_eqHscNcmy8hU_ennacFmQZOtLI_B3E_IebtYzjiJlnVFo9SGPjqUaEHUFCj_D8vUnvPZDVVhjwofPZ7V21jm4xDG64DEtqX0l6K4-ajbbQYIIL63bZt7g-LDECHRvLN6RolErre1-ZKVR9hHWo2-I3XBp_kERy",
    kitchen:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200",
    pos:
      "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1200",
  };

  const TabButton = ({
    id,
    label,
  }: {
    id: TabType;
    label: string;
  }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
        tab === id
          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
          : "border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="py-24 bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <TabButton id="owner" label="Owner View" />
          <TabButton id="kitchen" label="Kitchen Display" />
          <TabButton id="pos" label="Front-of-House" />
        </div>

        {/* Dashboard */}
        <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#1f1f1f] transition-all">
          <img
            src={images[tab]}
            alt={`${tab} dashboard`}
            className="w-full h-auto transition-opacity duration-300"
          />
        </div>

      </div>
    </section>
  );
}