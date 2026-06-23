"use client";

import { supplierApi } from "@/lib/api/supplier.api";
import { useQuery } from "@tanstack/react-query";

export function useSupplierById(supplierId: string) {
  return useQuery({
    queryKey: ["supplier by Id"],
    queryFn: () => supplierApi.getSupplierByIdApi(supplierId),
  });
}