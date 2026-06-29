"use client";

import { ticketApi } from "@/lib/api/ticket.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useLiveTickets({ page = 1, limit, search, status }: UsePaginationParams) {
  return useQuery({
    queryKey: ["tickets", page, limit, search, status],
    queryFn: () => ticketApi.getLiveTicketsApi({page, limit, search, status}),  
  });
}
