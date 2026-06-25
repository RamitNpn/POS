"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemRouter = void 0;
const express_1 = require("@ts-rest/express");
const menu_item_contract_1 = require("../../contract/menu-item/menu-item.contract");
const menu_item_mutation_1 = require("./menu-item.mutation");
const menu_item_query_1 = require("./menu-item.query");
const cloudinary_middleware_1 = require("../../middleware/cloudinary.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.menuItemRouter = s.router(menu_item_contract_1.menuItemContract, {
    createMenuItem: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin"), cloudinary_middleware_1.userUploadFields],
        handler: menu_item_mutation_1.menuItemMutationHandler.createMenuItem,
    },
    updateMenuItem: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin"), cloudinary_middleware_1.userUploadFields],
        handler: menu_item_mutation_1.menuItemMutationHandler.updateMenuItem,
    },
    removeMenuItem: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: menu_item_mutation_1.menuItemMutationHandler.removeMenuItem,
    },
    getAllMenuItems: menu_item_query_1.menuItemQueryHandler.getAllMenuItems,
    getMenuItemByID: {
        middleware: [auth_middleware_1.verifyToken],
        handler: menu_item_query_1.menuItemQueryHandler.getMenuItemByID,
    },
});
