import { initServer } from "@ts-rest/express";

import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import { menuCategoryMutationHandler } from "./menu-category.mutation";
import { menuCategoryQueryHandler } from "./menu-category.query";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const menuCategoryRouter = s.router(menuCategoryContract, {
  createMenuCategory: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: menuCategoryMutationHandler.createMenuCategory,
  },

  updateMenuCategory: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: menuCategoryMutationHandler.updateMenuCategory,
  },

  removeMenuCategory: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: menuCategoryMutationHandler.removeMenuCategory as any,
  },

  getAllMenuCategories: {
    middleware: [verifyToken, authorizeRoles("admin", "waiter", "cashier")],
    handler: menuCategoryQueryHandler.getAllMenuCategories,
  },

  getMenuCategoryByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: menuCategoryQueryHandler.getMenuCategoryByID,
  },
});
