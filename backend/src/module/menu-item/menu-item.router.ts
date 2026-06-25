import { initServer } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";

import { menuItemMutationHandler } from "./menu-item.mutation";
import { menuItemQueryHandler } from "./menu-item.query";

import { userUploadFields } from "../../middleware/cloudinary.middleware";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const menuItemRouter = s.router(menuItemContract, {
  createMenuItem: {
    middleware: [verifyToken, authorizeRoles("admin"), userUploadFields],
    handler: menuItemMutationHandler.createMenuItem,
  },

  updateMenuItem: {
    middleware: [verifyToken, authorizeRoles("admin"), userUploadFields],
    handler: menuItemMutationHandler.updateMenuItem,
  },

  removeMenuItem: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: menuItemMutationHandler.removeMenuItem as any,
  },

  getAllMenuItems: menuItemQueryHandler.getAllMenuItems,

  getMenuItemByID: {
    middleware: [verifyToken],
    handler: menuItemQueryHandler.getMenuItemByID,
  },
});
