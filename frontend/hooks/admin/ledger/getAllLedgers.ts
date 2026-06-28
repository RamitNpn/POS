"use client";

import { ledgerApi } from "@/lib/api/ledger.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllLedgers({ page = 1, limit, search, type }: UsePaginationParams) {
  return useQuery({
    queryKey: ["inventories", page, limit, search, type],
    queryFn: () => ledgerApi.getAllLedgerApi({page, limit, search, type}),  
  });
}
