"use client";

import { X } from "lucide-react";
import OrderForm from "./CreateOrderForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateOrderModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl bg-[#1c1c1c] rounded-2xl border border-[#2a2a2a] shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Create New Order</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <OrderForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
}