import { initServer } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";

import { menuItemMutationHandler } from "./menu-item.mutation";

import { menuItemQueryHandler } from "./menu-item.query";

const s = initServer();

export const menuItemRouter = s.router(menuItemContract, {
  createMenuItem: menuItemMutationHandler.createMenuItem,
  updateMenuItem: menuItemMutationHandler.updateMenuItem,
  removeMenuItem: menuItemMutationHandler.removeMenuItem,
  getAllMenuItems: menuItemQueryHandler.getAllMenuItems,
  getMenuItemByID: menuItemQueryHandler.getMenuItemByID,
});
