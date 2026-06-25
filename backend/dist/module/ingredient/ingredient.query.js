"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientQueryHandler = exports.getIngredientByID = exports.getAllIngredients = void 0;
const ingredient_repository_1 = __importDefault(require("../../repository/ingredient.repository"));
const getAllIngredients = async ({ req }) => {
    try {
        console.log("[GET ALL INGREDIENTS] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        console.log("[GET ALL INGREDIENTS] PARSED PAGINATION:", {
            page,
            limit,
        });
        const skip = (page - 1) * limit;
        console.log("[GET ALL INGREDIENTS] SKIP VALUE:", skip);
        console.log("[GET ALL INGREDIENTS] FILTERS:", {
            search: req.query.search,
            isActive: req.query.isActive,
        });
        console.log("[GET ALL INGREDIENTS] FETCHING FROM DB...");
        const { data, total } = await ingredient_repository_1.default.getAll({
            skip,
            limit,
            search: req.query.search,
            isActive: req.query.isActive,
        });
        console.log("[GET ALL INGREDIENTS] DB RESULT:", {
            returned: data?.length,
            total,
        });
        const formatted = data.map((ingredient) => ({
            _id: ingredient._id.toString(),
            name: ingredient.name,
            unit: ingredient.unit,
            currentStock: ingredient.currentStock,
            minimumStock: ingredient.minimumStock,
            lastStockInDate: ingredient.lastStockInDate,
            category: ingredient.category,
            isActive: ingredient.isActive,
            createdAt: ingredient.createdAt,
            updatedAt: ingredient.updatedAt,
        }));
        console.log("[GET ALL INGREDIENTS] FORMATTED COUNT:", formatted.length);
        return {
            status: 200,
            body: {
                data: formatted,
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
        console.error("[GET ALL INGREDIENTS] ERROR:", error);
        console.error("[GET ALL INGREDIENTS] QUERY:", req.query);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch ingredients",
            },
        };
    }
};
exports.getAllIngredients = getAllIngredients;
const getIngredientByID = async ({ req }) => {
    try {
        console.log("[GET INGREDIENT BY ID] PARAMS:", req.params);
        const ingredient = await ingredient_repository_1.default.getByID(req.params.ingredientId);
        console.log("[GET INGREDIENT BY ID] DB RESULT:", ingredient);
        if (!ingredient) {
            console.log("[GET INGREDIENT BY ID] NOT FOUND:", req.params.ingredientId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                _id: ingredient._id.toString(),
                name: ingredient.name,
                unit: ingredient.unit,
                currentStock: ingredient.currentStock,
                minimumStock: ingredient.minimumStock,
                lastStockInDate: ingredient.lastStockInDate,
                category: ingredient.category,
                isActive: ingredient.isActive,
                createdAt: ingredient.createdAt,
                updatedAt: ingredient.updatedAt,
            },
        };
    }
    catch (error) {
        console.error("[GET INGREDIENT BY ID] ERROR:", error);
        console.error("[GET INGREDIENT BY ID] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getIngredientByID = getIngredientByID;
exports.ingredientQueryHandler = {
    getAllIngredients: exports.getAllIngredients,
    getIngredientByID: exports.getIngredientByID,
};
