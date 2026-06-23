"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientMutationHandler = exports.deleteIngredient = exports.updateIngredient = exports.createIngredient = void 0;
const ingredient_repository_1 = __importDefault(require("../../repository/ingredient.repository"));
const stock_movement_repository_1 = __importDefault(require("../../repository/stock-movement.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const createIngredient = async ({ req }) => {
    try {
        const existing = await ingredient_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Ingredient already exists",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.create(req.body);
        if (req.body.currentStock > 0) {
            await stock_movement_repository_1.default.create({
                ingredientId: ingredient._id,
                type: "INITIAL_STOCK",
                quantity: req.body.currentStock,
                referenceType: "SYSTEM",
            });
            await ingredient_repository_1.default.update(ingredient._id.toString(), {
                lastStockInDate: new Date(),
            });
        }
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Create",
                details: `${admin.name} added an ingredient in ${ingredient.category}`,
                module: "Ingredient",
                entityId: `${ingredient._id}`,
                entityType: "Ingredient",
            });
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Ingredient created successfully",
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
exports.createIngredient = createIngredient;
const updateIngredient = async ({ req }) => {
    try {
        const { ingredientId } = req.params;
        const existing = await ingredient_repository_1.default.getByID(ingredientId);
        if (!existing) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.update(ingredientId, req.body);
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Update",
                details: `${admin.name} updated an ingredient in ${ingredient?.category || "list"}`,
                module: "Ingredient",
                entityId: `${ingredient?._id}`,
                entityType: "Ingredient",
            });
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Ingredient updated successfully",
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
exports.updateIngredient = updateIngredient;
const deleteIngredient = async ({ req }) => {
    try {
        const { ingredientId } = req.params;
        const existing = await ingredient_repository_1.default.getByID(ingredientId);
        if (!existing) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.delete(ingredientId);
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Delete",
                details: `${admin.name} deleted an ingredient from ${ingredient?.category || "list"}`,
                module: "Ingredient",
                entityId: `${ingredient?._id}`,
                entityType: "Ingredient",
            });
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Ingredient deleted successfully",
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
exports.deleteIngredient = deleteIngredient;
exports.ingredientMutationHandler = {
    createIngredient: exports.createIngredient,
    updateIngredient: exports.updateIngredient,
    deleteIngredient: exports.deleteIngredient,
};
