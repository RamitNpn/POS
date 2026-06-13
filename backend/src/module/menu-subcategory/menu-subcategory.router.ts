import { initServer } from "@ts-rest/express";

import { menuSubCategoryContract } from "../../contract/menu-subcategory/menu-subcategory.contract";

import { menuSubCategoryMutationHandler } from "./menu-subcategory.mutation";

import { menuSubCategoryQueryHandler } from "./menu-subcategory.query";

const s = initServer();

export const menuSubCategoryRouter = s.router(menuSubCategoryContract, {
  createMenuSubCategory: menuSubCategoryMutationHandler.createMenuSubCategory,
  updateMenuSubCategory: menuSubCategoryMutationHandler.updateMenuSubCategory,
  removeMenuSubCategory: menuSubCategoryMutationHandler.removeMenuSubCategory,

  getAllMenuSubCategories: menuSubCategoryQueryHandler.getAllMenuSubCategories,
  getMenuSubCategoryByID: menuSubCategoryQueryHandler.getMenuSubCategoryByID,
});
