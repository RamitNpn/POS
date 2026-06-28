"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientMutationHandler = exports.deleteIngredient = exports.updateIngredient = exports.createIngredient = void 0;
const ingredient_repository_1 = __importDefault(require("../../repository/ingredient.repository"));
const stock_movement_repository_1 = __importDefault(require("../../repository/stock-movement.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
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
            const stock = await stock_movement_repository_1.default.create({
                ingredientId: ingredient._id,
                type: "INITIAL_STOCK",
                quantity: req.body.currentStock,
                referenceType: "SYSTEM",
            });
            if (stock) {
                const stockLog = await log_repository_1.default.create({
                    userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
                    action: "Create",
                    details: `Stock recorded for ${ingredient?.name} at ${new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Kathmandu",
                    })}`,
                    module: "Stock",
                    entityId: `${stock._id}`,
                    entityType: "Ingredient",
                });
                if (!stockLog) {
                    console.log("User log not created", stockLog);
                }
            }
            const stockUpdate = await ingredient_repository_1.default.update(ingredient._id.toString(), {
                lastStockInDate: new Date(),
            });
            if (stockUpdate) {
                const stockUpdatelog = await log_repository_1.default.create({
                    userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
                    action: "Create",
                    details: `Stock updated in ${ingredient?.name} at ${new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Kathmandu",
                    })}`,
                    module: "Stock",
                    entityId: `${ingredient._id}`,
                    entityType: "Stock",
                });
                if (!stockUpdatelog) {
                    console.log("User log not created", stockUpdatelog);
                }
            }
            console.log("[CREATE INGREDIENT] STOCK & LAST STOCK DATE UPDATED");
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Create",
            details: `${ingredient?.name} created at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ingredient",
            entityId: `${ingredient._id}`,
            entityType: "Ingredient",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[CREATE INGREDIENT] LOG CREATED");
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
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `${ingredient?.name} updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ingredient",
            entityId: `${ingredient?._id}`,
            entityType: "Ingredient",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[UPDATE INGREDIENT] LOG CREATED");
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
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Delete",
            details: `${ingredient?.name} deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ingredient",
            entityId: `${ingredient?._id}`,
            entityType: "Ingredient",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[DELETE INGREDIENT] LOG CREATED");
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
