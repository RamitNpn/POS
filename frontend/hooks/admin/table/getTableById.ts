"use client";
import { tableApi } from "@/lib/api/table.api";
import { useQuery } from "@tanstack/react-query";

export function useTableById(tableId: string) {
  return useQuery({
    queryKey: ["table", tableId],
    queryFn: () => tableApi.getTableByIdApi(tableId),
    enabled: Boolean(tableId),
  });
}
