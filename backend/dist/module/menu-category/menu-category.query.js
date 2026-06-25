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
        console.log("[GET ALL MENU CATEGORIES] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        console.log("[GET ALL MENU CATEGORIES] PARSED:", { page, limit });
        const skip = (page - 1) * limit;
        console.log("[GET ALL MENU CATEGORIES] SKIP VALUE:", skip);
        console.log("[GET ALL MENU CATEGORIES] SEARCH:", req.query.search);
        console.log("[GET ALL MENU CATEGORIES] FETCHING CATEGORIES...");
        const { data, total } = await menu_category_repository_1.default.getAll({
            skip,
            limit,
            search: req.query.search,
        });
        console.log("[GET ALL MENU CATEGORIES] DB RESULT:", {
            returned: data?.length,
            total,
        });
        console.log("[GET ALL MENU CATEGORIES] ENRICHING ITEM COUNTS...");
        const formattedData = await Promise.all(data.map(async (category) => {
            console.log("[CATEGORY PROCESSING]", category._id.toString());
            const itemCount = await menu_item_repository_1.default.countByCategory(category._id.toString());
            console.log("[CATEGORY ITEM COUNT]", {
                categoryId: category._id.toString(),
                itemCount,
            });
            return {
                _id: category._id.toString(),
                name: category.name,
                description: category.description,
                itemCount,
            };
        }));
        console.log("[GET ALL MENU CATEGORIES] FORMATTED COUNT:", formattedData.length);
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
    catch (error) {
        console.error("[GET ALL MENU CATEGORIES] ERROR:", error);
        console.error("[GET ALL MENU CATEGORIES] QUERY:", req.query);
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
    try {
        console.log("[GET MENU CATEGORY BY ID] PARAMS:", req.params);
        const category = await menu_category_repository_1.default.getByID(req.params.categoryID);
        console.log("[GET MENU CATEGORY BY ID] DB RESULT:", category);
        if (!category) {
            console.log("[GET MENU CATEGORY BY ID] NOT FOUND:", req.params.categoryID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Category not found",
                },
            };
        }
        console.log("[GET MENU CATEGORY BY ID] FETCHING ITEM COUNT...");
        const itemCount = await menu_item_repository_1.default.countByCategory(category._id.toString());
        console.log("[GET MENU CATEGORY BY ID] ITEM COUNT:", itemCount);
        return {
            status: 200,
            body: {
                _id: category._id.toString(),
                name: category.name,
                description: category.description,
                itemCount,
                createdAt: category.createdAt,
            },
        };
    }
    catch (error) {
        console.error("[GET MENU CATEGORY BY ID] ERROR:", error);
        console.error("[GET MENU CATEGORY BY ID] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getMenuCategoryByID = getMenuCategoryByID;
exports.menuCategoryQueryHandler = {
    getAllMenuCategories: exports.getAllMenuCategories,
    getMenuCategoryByID: exports.getMenuCategoryByID,
};
