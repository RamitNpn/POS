"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementQueryHandler = exports.getByIngredient = exports.getAllStockMovements = exports.mapStockMovement = void 0;
const stock_movement_repository_1 = __importDefault(require("../../repository/stock-movement.repository"));
const mapStockMovement = (m) => {
    console.log("[mapStockMovement] raw:", {
        id: m?._id,
        ingredientId: m?.ingredientId,
        type: m?.type,
        quantity: m?.quantity,
    });
    const mapped = {
        _id: m._id.toString(),
        ingredient: {
            _id: m.ingredientId?._id?.toString() ?? "",
            name: m.ingredientId?.name ?? "",
            minimumStock: m.ingredientId?.minimumStock ?? 0,
            currentStock: m.ingredientId?.currentStock ?? 0,
            lastStockInDate: m.ingredientId?.lastStockInDate ?? "",
        },
        type: m.type,
        quantity: m.quantity,
        referenceType: m.referenceType,
        createdAt: m.createdAt?.toISOString?.() ?? "",
    };
    console.log("[mapStockMovement] mapped:", mapped);
    return mapped;
};
exports.mapStockMovement = mapStockMovement;
const getAllStockMovements = async ({ req }) => {
    try {
        console.log("[getAllStockMovements] request query:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        console.log("[getAllStockMovements] pagination:", { page, limit });
        const skip = (page - 1) * limit;
        console.log("[getAllStockMovements] skip:", skip);
        const { data, total } = await stock_movement_repository_1.default.getAll({
            skip,
            limit,
        });
        console.log("[getAllStockMovements] raw result:", {
            dataLength: data?.length,
            total,
        });
        const formatted = data.map((item, index) => {
            console.log(`[getAllStockMovements] mapping index ${index}`);
            return (0, exports.mapStockMovement)(item);
        });
        console.log("[getAllStockMovements] formatted sample:", formatted.slice(0, 2));
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
        console.error("[getAllStockMovements] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch stock movements",
            },
        };
    }
};
exports.getAllStockMovements = getAllStockMovements;
const getByIngredient = async ({ req }) => {
    try {
        console.log("[getByIngredient] ingredientId:", req.params.ingredientId);
        const data = await stock_movement_repository_1.default.getByIngredient(req.params.ingredientId);
        console.log("[getByIngredient] raw data length:", data?.length);
        const formatted = data.map((item, index) => {
            console.log(`[getByIngredient] mapping index ${index}`);
            return (0, exports.mapStockMovement)(item);
        });
        console.log("[getByIngredient] formatted sample:", formatted.slice(0, 2));
        return {
            status: 200,
            body: formatted,
        };
    }
    catch (error) {
        console.error("[getByIngredient] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getByIngredient = getByIngredient;
exports.stockMovementQueryHandler = {
    getAllStockMovements: exports.getAllStockMovements,
    getByIngredient: exports.getByIngredient,
};
