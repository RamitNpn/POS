"use client";

import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export function useCashierDashboardStats() {
  return useQuery({
    queryKey: ["cashier-dashboard-stats"],
    queryFn: () => statsApi.getCashierDashboardStats(),  
  });
}