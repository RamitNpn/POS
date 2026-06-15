"use client";

import { roomApi } from "@/lib/api/room.api";
import { userApi } from "@/lib/api/user.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllRooms({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["rooms", page, limit, search],
    queryFn: () => roomApi.getAllRoomApi({page, limit, search}),  
  });
}