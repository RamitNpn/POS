"use client";

import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function FloatingButton() {
  const router = useRouter();

  return (
    <a
      href="#checkout"
      className="fixed top-30 right-8 z-50 lg:hidden text-white text-sm font-medium bg-primary px-3 py-2 rounded-full flex items-center gap-1"
    >
      Invoice
      <ArrowDown className="size-4" />
    </a>
  );
}
