"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSubCategoryRouter = void 0;
const express_1 = require("@ts-rest/express");
const menu_subcategory_contract_1 = require("../../contract/menu-subcategory/menu-subcategory.contract");
const menu_subcategory_mutation_1 = require("./menu-subcategory.mutation");
const menu_subcategory_query_1 = require("./menu-subcategory.query");
const s = (0, express_1.initServer)();
exports.menuSubCategoryRouter = s.router(menu_subcategory_contract_1.menuSubCategoryContract, {
    createMenuSubCategory: menu_subcategory_mutation_1.menuSubCategoryMutationHandler.createMenuSubCategory,
    updateMenuSubCategory: menu_subcategory_mutation_1.menuSubCategoryMutationHandler.updateMenuSubCategory,
    removeMenuSubCategory: menu_subcategory_mutation_1.menuSubCategoryMutationHandler.removeMenuSubCategory,
    getAllMenuSubCategories: menu_subcategory_query_1.menuSubCategoryQueryHandler.getAllMenuSubCategories,
    getMenuSubCategoryByID: menu_subcategory_query_1.menuSubCategoryQueryHandler.getMenuSubCategoryByID,
});
