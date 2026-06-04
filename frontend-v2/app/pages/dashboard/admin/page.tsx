"use client";

import { useState } from "react";

const tabs = ["Overview", "Analytics", "Orders", "Logs"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      {/* STAT CARDS */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Revenue", value: "$42,900" },
          { label: "Orders", value: "1,240" },
          { label: "Tables", value: "18 Active" },
          { label: "Staff", value: "24" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#141414] border border-white/10 p-5 rounded-xl"
          >
            <p className="text-white/50 text-sm">{item.label}</p>
            <h2 className="text-xl font-bold text-yellow-400 mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              activeTab === tab
                ? "bg-yellow-400 text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="bg-[#141414] border border-white/10 pt-2 pb-8 px-8 rounded-xl h-72">
          <h3 className="text-white">Revenue Chart</h3>
          <div className="h-full flex items-end gap-2">
            {[40, 60, 30, 80, 100].map((h, i) => (
              <div
                key={i}
                className="bg-yellow-400/40 w-full rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-xl lg:col-span-2">
          <h3 className="text-white mb-4">Recent Orders</h3>

          <table className="w-full text-sm text-white/70">
            <thead>
              <tr className="text-left text-white/40">
                <th>Order</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["#1021", "Completed", "$120"],
                ["#1022", "Pending", "$80"],
                ["#1023", "Preparing", "$60"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="py-2">{row[0]}</td>
                  <td>{row[1]}</td>
                  <td className="text-yellow-400">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}