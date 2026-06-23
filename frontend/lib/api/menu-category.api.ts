import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TCreateMenuCategorySchema,
  TDeleteMenuCategorySchema,
  TGetMenuCategoryByIdSchema,
  TUpdateMenuCategorySchema,
} from "../validations/menu-category.validation";

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

const getMenuCategoryByIdApi = async (
  menuCategoryId: TGetMenuCategoryByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/menu-category/${menuCategoryId}`);
  return response.data;
};

const updateMenuCategoryApi = async (
  menuCategoryId: string,
  data: TUpdateMenuCategorySchema,
) => {
  const response = await apiClient.put(
    `/menu-category/${menuCategoryId}`,
    data,
  );
  return response.data;
};

const deleteMenuCategoryApi = async (
  menuCategoryId: TDeleteMenuCategorySchema["_id"],
) => {
  const response = await apiClient.delete(`/menu-category/${menuCategoryId}`);
  return response.data;
};

export const menuCategoryApi = {
  createMenuCategory,
  getAllMenuCategoryApi,
  getMenuCategoryByIdApi,
  updateMenuCategoryApi,
  deleteMenuCategoryApi,
};
