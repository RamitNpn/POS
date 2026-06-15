import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateMenuCategorySchema, TDeleteMenuCategorySchema, TGetMenuCategoryByIdSchema } from "../validations/menu-category.validation";

export const createMenuCategory = async (data: TCreateMenuCategorySchema) => {
  const res = await apiClient.post("/menu-category", data);
  return res.data;
};

const getAllMenuCategoryApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/menu-category", {
    params,
  });
  return response.data;
};

const getMenuCategoryByIdApi = async (MenuCategoryId: TGetMenuCategoryByIdSchema["_id"]) => {
  const response = await apiClient.get(`/menu-category/${MenuCategoryId}`);
  return response.data;
};

const updateMenuCategoryApi = async (MenuCategoryId: string, formData: FormData) => {
  const response = await apiClient.put(`/menu-category/${MenuCategoryId}`, formData, {});
  return response.data;
};

const deleteMenuCategoryApi = async (MenuCategoryId: TDeleteMenuCategorySchema["_id"]) => {
  const response = await apiClient.delete(`/menu-category/${MenuCategoryId}`);
  return response.data;
};

export const menuCategoryApi = {
  createMenuCategory,
  getAllMenuCategoryApi,
  getMenuCategoryByIdApi,
  updateMenuCategoryApi,
  deleteMenuCategoryApi,
};
