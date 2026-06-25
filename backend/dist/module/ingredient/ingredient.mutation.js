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
        console.log("[CREATE INGREDIENT] REQUEST BODY:", req.body);
        const existing = await ingredient_repository_1.default.getByName(req.body.name);
        console.log("[CREATE INGREDIENT] EXISTING CHECK:", existing);
        if (existing) {
            console.log("[CREATE INGREDIENT] DUPLICATE FOUND:", req.body.name);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Ingredient already exists",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.create(req.body);
        console.log("[CREATE INGREDIENT] CREATED:", ingredient);
        if (req.body.currentStock > 0) {
            console.log("[CREATE INGREDIENT] INITIAL STOCK ADDED:", req.body.currentStock);
            await stock_movement_repository_1.default.create({
                ingredientId: ingredient._id,
                type: "INITIAL_STOCK",
                quantity: req.body.currentStock,
                referenceType: "SYSTEM",
            });
            await ingredient_repository_1.default.update(ingredient._id.toString(), {
                lastStockInDate: new Date(),
            });
            console.log("[CREATE INGREDIENT] STOCK & LAST STOCK DATE UPDATED");
        }
        const admins = await user_repository_1.default.getByRole("admin");
        console.log("[CREATE INGREDIENT] ADMINS FOUND:", admins?.length);
        const admin = admins?.[0];
        if (admin) {
            console.log("[CREATE INGREDIENT] LOGGING ADMIN ACTION:", admin._id);
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Create",
                details: `${admin.name} added an ingredient in ${ingredient.category}`,
                module: "Ingredient",
                entityId: `${ingredient._id}`,
                entityType: "Ingredient",
            });
            console.log("[CREATE INGREDIENT] LOG CREATED");
        }
        else {
            console.log("[CREATE INGREDIENT] NO ADMIN FOUND");
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
        console.error("[CREATE INGREDIENT] ERROR:", error);
        console.error("[CREATE INGREDIENT] REQUEST BODY:", req.body);
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
        console.log("[UPDATE INGREDIENT] PARAMS:", req.params);
        console.log("[UPDATE INGREDIENT] BODY:", req.body);
        const existing = await ingredient_repository_1.default.getByID(ingredientId);
        console.log("[UPDATE INGREDIENT] EXISTING:", existing);
        if (!existing) {
            console.log("[UPDATE INGREDIENT] NOT FOUND:", ingredientId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.update(ingredientId, req.body);
        console.log("[UPDATE INGREDIENT] UPDATED:", ingredient);
        const admins = await user_repository_1.default.getByRole("admin");
        console.log("[UPDATE INGREDIENT] ADMINS FOUND:", admins?.length);
        const admin = admins?.[0];
        if (admin) {
            console.log("[UPDATE INGREDIENT] LOGGING ADMIN ACTION:", admin._id);
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Update",
                details: `${admin.name} updated an ingredient in ${ingredient?.category || "list"}`,
                module: "Ingredient",
                entityId: `${ingredient?._id}`,
                entityType: "Ingredient",
            });
            console.log("[UPDATE INGREDIENT] LOG CREATED");
        }
        else {
            console.log("[UPDATE INGREDIENT] NO ADMIN FOUND");
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
        console.error("[UPDATE INGREDIENT] ERROR:", error);
        console.error("[UPDATE INGREDIENT] PARAMS:", req.params);
        console.error("[UPDATE INGREDIENT] BODY:", req.body);
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
        console.log("[DELETE INGREDIENT] PARAMS:", req.params);
        const existing = await ingredient_repository_1.default.getByID(ingredientId);
        console.log("[DELETE INGREDIENT] EXISTING:", existing);
        if (!existing) {
            console.log("[DELETE INGREDIENT] NOT FOUND:", ingredientId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        const ingredient = await ingredient_repository_1.default.delete(ingredientId);
        console.log("[DELETE INGREDIENT] DELETED:", ingredient);
        const admins = await user_repository_1.default.getByRole("admin");
        console.log("[DELETE INGREDIENT] ADMINS FOUND:", admins?.length);
        const admin = admins?.[0];
        if (admin) {
            console.log("[DELETE INGREDIENT] LOGGING ADMIN ACTION:", admin._id);
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Ingredient Delete",
                details: `${admin.name} deleted an ingredient from ${ingredient?.category || "list"}`,
                module: "Ingredient",
                entityId: `${ingredient?._id}`,
                entityType: "Ingredient",
            });
            console.log("[DELETE INGREDIENT] LOG CREATED");
        }
        else {
            console.log("[DELETE INGREDIENT] NO ADMIN FOUND");
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
        console.error("[DELETE INGREDIENT] ERROR:", error);
        console.error("[DELETE INGREDIENT] PARAMS:", req.params);
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
