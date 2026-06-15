import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateOrderSchema, TDeleteOrderSchema, TGetOrderByIdSchema } from "../validations/order.validation";

export const createOrder = async (data: TCreateOrderSchema) => {
  const res = await apiClient.post("/orders", data);
  return res.data;
};

const getAllOrderApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/orders", {
    params,
  });
  return response.data;
};

const getOrderByIdApi = async (OrderId: TGetOrderByIdSchema["_id"]) => {
  const response = await apiClient.get(`/orders/${OrderId}`);
  return response.data;
};

const updateOrderApi = async (OrderId: string, formData: FormData) => {
  const response = await apiClient.put(`/orders/${OrderId}`, formData, {});
  return response.data;
};

const deleteOrderApi = async (OrderId: TDeleteOrderSchema["_id"]) => {
  const response = await apiClient.delete(`/orders/${OrderId}`);
  return response.data;
};

export const orderApi = {
  createOrder,
  getAllOrderApi,
  getOrderByIdApi,
  updateOrderApi,
  deleteOrderApi,
};
