import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TCreateLedgerSchema,
  TDeleteLedgerSchema,
  TGetLedgerByIdSchema,
  TUpdateLedgerSchema,
} from "../validations/ledger.validation";

export const createLedger = async (data: TCreateLedgerSchema) => {
  try {
    const res = await apiClient.post("/ledger", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

const getAllLedgerApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/ledger", {
    params,
  });
  return response.data;
};

const getLedgerByIdApi = async (ledgerId: TGetLedgerByIdSchema["_id"]) => {
  const response = await apiClient.get(`/ledger/${ledgerId}`);
  return response.data;
};

const updateLedgerApi = async (ledgerId: string, data: TUpdateLedgerSchema) => {
  const response = await apiClient.put(`/ledger/${ledgerId}`, data);
  return response.data;
};

const deleteLedgerApi = async (ledgerId: TDeleteLedgerSchema["_id"]) => {
  const response = await apiClient.delete(`/ledger/${ledgerId}`);
  return response.data;
};

export const ledgerApi = {
  createLedger,
  getAllLedgerApi,
  getLedgerByIdApi,
  updateLedgerApi,
  deleteLedgerApi,
};
