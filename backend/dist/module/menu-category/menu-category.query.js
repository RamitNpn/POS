"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuCategoryQueryHandler = exports.getMenuCategoryByID = exports.getAllMenuCategories = void 0;
const menu_category_repository_1 = __importDefault(require("../../repository/menu-category.repository"));
const menu_item_repository_1 = __importDefault(require("../../repository/menu-item-repository"));
const getAllMenuCategories = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const { data, total } = await menu_category_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
        });
        const formattedData = await Promise.all(data.map(async (category) => {
            const itemCount = await menu_item_repository_1.default.countByCategory(category._id.toString());
            return {
                _id: category._id.toString(),
                name: category.name,
                description: category.description,
                itemCount,
            };
        }));
        return {
            status: 200,
            body: {
                data: formattedData,
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
                error: "Failed to fetch menu categories",
            },
        };
    }
};
exports.getAllMenuCategories = getAllMenuCategories;
const getMenuCategoryByID = async ({ req }) => {
    const category = await menu_category_repository_1.default.getByID(req.params.categoryID);
    if (!category) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Category not found",
            },
        };
    }
    const itemCount = await menu_item_repository_1.default.countByCategory(category._id.toString());
    return {
        status: 200,
        body: {
            _id: category._id.toString(),
            name: category.name,
            description: category.description,
            itemCount: itemCount,
            createdAt: category.createdAt,
        },
    };
};
exports.getMenuCategoryByID = getMenuCategoryByID;
exports.menuCategoryQueryHandler = {
    getAllMenuCategories: exports.getAllMenuCategories,
    getMenuCategoryByID: exports.getMenuCategoryByID,
};
