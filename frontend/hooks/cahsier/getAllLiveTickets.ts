"use client";

import { ticketApi } from "@/lib/api/ticket.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useLiveTickets({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["tickets", page, limit, search],
    queryFn: () => ticketApi.getLiveTicketsApi({page, limit, search}),  
  });
}
