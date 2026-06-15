"use client";

import { userApi } from "@/lib/api/user.api";
import { useQuery } from "@tanstack/react-query";

export function useUserById(userId: string) {
  return useQuery({
    queryKey: ["user by Id"],
    queryFn: () => userApi.getUserByIdApi(userId),
  });
}