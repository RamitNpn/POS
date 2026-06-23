"use client";

import { ticketApi } from "@/lib/api/ticket.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllTickets({ page = 1, limit, search, status }: UsePaginationParams) {
  return useQuery({
    queryKey: ["all-tickets", page, limit, search, status],
    queryFn: () => ticketApi.getAllTicketsApi({page, limit, search, status}),  
  });
}
