import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateMenuItemSchema, TDeleteMenuItemSchema, TGetMenuItemByIdSchema } from "../validations/menu-item.validation";

export const createMenuItem = async (data: TCreateMenuItemSchema) => {
  const res = await apiClient.post("/menu-item", data);
  return res.data;
};

const getAllMenuItemApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/menu-item", {
    params,
  });
  return response.data;
};

const getMenuItemByIdApi = async (MenuItemId: TGetMenuItemByIdSchema["_id"]) => {
  const response = await apiClient.get(`/menu-item/${MenuItemId}`);
  return response.data;
};

const updateMenuItemApi = async (MenuItemId: string, formData: FormData) => {
  const response = await apiClient.put(`/menu-item/${MenuItemId}`, formData, {});
  return response.data;
};

const deleteMenuItemApi = async (MenuItemId: TDeleteMenuItemSchema["_id"]) => {
  const response = await apiClient.delete(`/menu-item/${MenuItemId}`);
  return response.data;
};

export const menuItemApi = {
  createMenuItem,
  getAllMenuItemApi,
  getMenuItemByIdApi,
  updateMenuItemApi,
  deleteMenuItemApi,
};
