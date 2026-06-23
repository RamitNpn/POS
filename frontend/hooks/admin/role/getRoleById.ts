"use client";
import { roleApi } from "@/lib/api/role.api";
import { useQuery } from "@tanstack/react-query";

export function useRoleById(roleId: string) {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => roleApi.getRoleByIdApi(roleId),
    enabled: Boolean(roleId),
  });
}
