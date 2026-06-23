import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TCreateOrderSchema,
  TDeleteOrderSchema,
  TGetOrderByIdSchema,
} from "../validations/order.validation";

export const createOrder = async (data: TCreateOrderSchema) => {
  const res = await apiClient.post("/order", data);
  return res.data;
};

const getAllOrderApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/order", {
    params,
  });
  return response.data;
};

const getOrderByIdApi = async (OrderId: TGetOrderByIdSchema["_id"]) => {
  const response = await apiClient.get(`/order/${OrderId}`);
  return response.data;
};

const getActiveOrderByTableApi = async (tableId: string) => {
  const response = await apiClient.get(`/order/table/${tableId}`);
  return response.data;
};

// Replace getOrderByDateApi in lib/api/order.api.ts
const getOrderByDateApi = async (params: { dateReport: string }) => {
  const response = await apiClient.get("/order/date-report", {
    params: {
      dateReport: params.dateReport // Explicitly bind the exact string key expected by Zod
    },
  });
  return response.data;
};

const updateOrderApi = async (OrderId: string, formData: FormData) => {
  const response = await apiClient.put(`/order/${OrderId}`, formData, {});
  return response.data;
};

const updatePaymentStatusApi = async (
  OrderId: string,
  status: string,
  paymentStatus: string,
) => {
  const response = await apiClient.put(`/order/payment/${OrderId}`, {
    status,
    paymentStatus,
  });
  return response.data;
};

const deleteOrderApi = async (OrderId: TDeleteOrderSchema["_id"]) => {
  const response = await apiClient.delete(`/order/${OrderId}`);
  return response.data;
};

export const orderApi = {
  createOrder,
  getAllOrderApi,
  getOrderByIdApi,
  updateOrderApi,
  updatePaymentStatusApi,
  deleteOrderApi,
  getActiveOrderByTableApi,
  getOrderByDateApi,
};
