import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import { TCreateMenuSubCategorySchema, TDeleteMenuSubCategorySchema, TGetMenuSubCategoryByIdSchema } from "../validations/menu-subcategory.validation";

export const createMenuSubCategory = async (data: TCreateMenuSubCategorySchema) => {
  const res = await apiClient.post("/menu-subcategory", data);
  return res.data;
};

const getAllMenuSubCategoryApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/menu-subcategory", {
    params,
  });
  return response.data;
};

const getMenuSubCategoryByIdApi = async (MenuSubCategoryId: TGetMenuSubCategoryByIdSchema["_id"]) => {
  const response = await apiClient.get(`/menu-subcategory/${MenuSubCategoryId}`);
  return response.data;
};

const updateMenuSubCategoryApi = async (MenuSubCategoryId: string, formData: FormData) => {
  const response = await apiClient.put(`/menu-subcategory/${MenuSubCategoryId}`, formData, {});
  return response.data;
};

const deleteMenuSubCategoryApi = async (MenuSubCategoryId: TDeleteMenuSubCategorySchema["_id"]) => {
  const response = await apiClient.delete(`/menu-subcategory/${MenuSubCategoryId}`);
  return response.data;
};

export const menuSubCategoryApi = {
  createMenuSubCategory,
  getAllMenuSubCategoryApi,
  getMenuSubCategoryByIdApi,
  updateMenuSubCategoryApi,
  deleteMenuSubCategoryApi,
};
