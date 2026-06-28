"use client";

import { ticketApi } from "@/lib/api/ticket.api";
import { useQuery } from "@tanstack/react-query";

export function useTicketByTableId(tableId: string) {
  return useQuery({
    queryKey: ["ticket by table Id"],
    queryFn: () => ticketApi.getTicketByTableIdApi(tableId),
  });
}