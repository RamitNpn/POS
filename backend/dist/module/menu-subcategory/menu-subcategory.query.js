"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSubCategoryQueryHandler = exports.getMenuSubCategoryByID = exports.getAllMenuSubCategories = void 0;
const menu_subcategory_repository_1 = __importDefault(require("../../repository/menu-subcategory.repository"));
const getAllMenuSubCategories = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await menu_subcategory_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            categoryId: req.query.categoryId,
        });
        return {
            status: 200,
            body: {
                data: data.map((item) => ({
                    _id: item._id.toString(),
                    name: item.name,
                    description: item.description,
                    categoryId: item.categoryId.toString(),
                    categoryName: item.categoryName,
                    itemCount: item.itemCount,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch sub categories",
            },
        };
    }
};
exports.getAllMenuSubCategories = getAllMenuSubCategories;
const getMenuSubCategoryByID = async ({ req }) => {
    const subCategory = await menu_subcategory_repository_1.default.getByID(req.params.subCategoryID);
    if (!subCategory) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Sub category not found",
            },
        };
    }
    return {
        status: 200,
        body: {
            _id: subCategory._id.toString(),
            name: subCategory.name,
            description: subCategory.description,
            categoryId: subCategory.categoryId.toString(),
            categoryName: subCategory.categoryName,
            itemCount: subCategory.itemCount,
        },
    };
};
exports.getMenuSubCategoryByID = getMenuSubCategoryByID;
exports.menuSubCategoryQueryHandler = {
    getAllMenuSubCategories: exports.getAllMenuSubCategories,
    getMenuSubCategoryByID: exports.getMenuSubCategoryByID,
};
