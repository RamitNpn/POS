"use client";

import { ledgerApi } from "@/lib/api/ledger.api";
import { useQuery } from "@tanstack/react-query";

export function useLedgerById(ledgerId: string) {
  return useQuery({
    queryKey: ["ledger by Id"],
    queryFn: () => ledgerApi.getLedgerByIdApi(ledgerId),
  });
}
