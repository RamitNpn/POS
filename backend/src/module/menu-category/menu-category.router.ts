import { initServer } from "@ts-rest/express";

import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import { menuCategoryMutationHandler } from "./menu-category.mutation";
import { menuCategoryQueryHandler } from "./menu-category.query";

const s = initServer();

export const menuCategoryRouter = s.router(menuCategoryContract, {
  createMenuCategory: menuCategoryMutationHandler.createMenuCategory,
  updateMenuCategory: menuCategoryMutationHandler.updateMenuCategory,
  removeMenuCategory: menuCategoryMutationHandler.removeMenuCategory,

  getAllMenuCategories: menuCategoryQueryHandler.getAllMenuCategories,
  getMenuCategoryByID: menuCategoryQueryHandler.getMenuCategoryByID,
});
