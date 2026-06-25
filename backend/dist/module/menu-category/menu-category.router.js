"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuCategoryRouter = void 0;
const express_1 = require("@ts-rest/express");
const menu_category_contract_1 = require("../../contract/menu-category/menu-category.contract");
const menu_category_mutation_1 = require("./menu-category.mutation");
const menu_category_query_1 = require("./menu-category.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.menuCategoryRouter = s.router(menu_category_contract_1.menuCategoryContract, {
    createMenuCategory: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: menu_category_mutation_1.menuCategoryMutationHandler.createMenuCategory,
    },
    updateMenuCategory: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: menu_category_mutation_1.menuCategoryMutationHandler.updateMenuCategory,
    },
    removeMenuCategory: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: menu_category_mutation_1.menuCategoryMutationHandler.removeMenuCategory,
    },
    getAllMenuCategories: menu_category_query_1.menuCategoryQueryHandler.getAllMenuCategories,
    getMenuCategoryByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: menu_category_query_1.menuCategoryQueryHandler.getMenuCategoryByID,
    },
});
