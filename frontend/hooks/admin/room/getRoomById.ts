"use client";
import { roomApi } from "@/lib/api/room.api";
import { useQuery } from "@tanstack/react-query";

export function useRoomById(roomId: string) {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => roomApi.getRoomByIdApi(roomId),
    enabled: Boolean(roomId),
  });
}
