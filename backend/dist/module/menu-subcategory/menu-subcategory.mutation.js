"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSubCategoryMutationHandler = exports.removeMenuSubCategory = exports.updateMenuSubCategory = exports.createMenuSubCategory = void 0;
const menu_subcategory_repository_1 = __importDefault(require("../../repository/menu-subcategory.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createMenuSubCategory = async ({ req }) => {
    try {
        const existing = await menu_subcategory_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Sub category already exists",
                },
            };
        }
        await menu_subcategory_repository_1.default.create({
            ...req.body,
            categoryId: req.body.categoryId
                ? new mongoose_1.default.Types.ObjectId(req.body.categoryId)
                : undefined,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Menu sub-category created successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createMenuSubCategory = createMenuSubCategory;
const updateMenuSubCategory = async ({ req }) => {
    try {
        const { subCategoryID } = req.params;
        const subCategory = await menu_subcategory_repository_1.default.getByID(subCategoryID);
        if (!subCategory) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Sub category not found",
                },
            };
        }
        if (req.body.name && req.body.name !== subCategory.name) {
            const exists = await menu_subcategory_repository_1.default.getByName(req.body.name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Sub category already exists",
                    },
                };
            }
        }
        await menu_subcategory_repository_1.default.update(subCategoryID, req.body);
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu sub-category updated successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateMenuSubCategory = updateMenuSubCategory;
const removeMenuSubCategory = async ({ req }) => {
    try {
        const { subCategoryID } = req.params;
        const subCategory = await menu_subcategory_repository_1.default.getByID(subCategoryID);
        if (!subCategory) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Sub category not found",
                },
            };
        }
        await menu_subcategory_repository_1.default.delete(subCategoryID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu sub-category deleted successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.removeMenuSubCategory = removeMenuSubCategory;
exports.menuSubCategoryMutationHandler = {
    createMenuSubCategory: exports.createMenuSubCategory,
    updateMenuSubCategory: exports.updateMenuSubCategory,
    removeMenuSubCategory: exports.removeMenuSubCategory,
};
