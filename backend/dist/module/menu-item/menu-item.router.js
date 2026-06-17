"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemRouter = void 0;
const express_1 = require("@ts-rest/express");
const menu_item_contract_1 = require("../../contract/menu-item/menu-item.contract");
const menu_item_mutation_1 = require("./menu-item.mutation");
const menu_item_query_1 = require("./menu-item.query");
const cloudinary_middleware_1 = require("../../middleware/cloudinary.middleware");
const s = (0, express_1.initServer)();
exports.menuItemRouter = s.router(menu_item_contract_1.menuItemContract, {
    createMenuItem: {
        middleware: [cloudinary_middleware_1.userUploadFields],
        handler: menu_item_mutation_1.menuItemMutationHandler.createMenuItem,
    },
    updateMenuItem: {
        middleware: [cloudinary_middleware_1.userUploadFields],
        handler: menu_item_mutation_1.menuItemMutationHandler.updateMenuItem,
    },
    removeMenuItem: menu_item_mutation_1.menuItemMutationHandler.removeMenuItem,
    getAllMenuItems: menu_item_query_1.menuItemQueryHandler.getAllMenuItems,
    getMenuItemByID: menu_item_query_1.menuItemQueryHandler.getMenuItemByID,
});
