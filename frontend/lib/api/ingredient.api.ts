import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TCreateIngredientSchema,
  TDeleteIngredientSchema,
  TGetIngredientByIdSchema,
  TUpdateIngredientSchema,
} from "../validations/inventory.validation";

export const createIngredient = async (data: TCreateIngredientSchema) => {
  try {
    const res = await apiClient.post("/ingredient", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

const getAllIngredientApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/ingredient", {
    params,
  });
  return response.data;
};

const getIngredientByIdApi = async (
  ingredientId: TGetIngredientByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/ingredient/${ingredientId}`);
  return response.data;
};

const updateIngredientApi = async (
  ingredientId: string,
  data: TUpdateIngredientSchema,
) => {
  const response = await apiClient.put(`/ingredient/${ingredientId}`, data);
  return response.data;
};

const deleteIngredientApi = async (
  ingredientId: TDeleteIngredientSchema["_id"],
) => {
  const response = await apiClient.delete(`/ingredient/${ingredientId}`);
  return response.data;
};

export const ingredientApi = {
  createIngredient,
  getAllIngredientApi,
  getIngredientByIdApi,
  updateIngredientApi,
  deleteIngredientApi,
};
