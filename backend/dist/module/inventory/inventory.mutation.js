"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryMutationHandler = exports.removeInventory = exports.updateInventory = exports.createInventory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const inventory_repository_1 = __importDefault(require("../../repository/inventory.repository"));
const createInventory = async ({ req }) => {
    try {
        const existing = await inventory_repository_1.default.getBySKU(req.body.sku);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "SKU already exists",
                },
            };
        }
        await inventory_repository_1.default.create({
            ...req.body,
            supplierId: req.body.supplierId
                ? new mongoose_1.default.Types.ObjectId(req.body.supplierId)
                : undefined,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Inventory item created successfully",
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
exports.createInventory = createInventory;
const updateInventory = async ({ req }) => {
    try {
        const { inventoryID } = req.params;
        const item = await inventory_repository_1.default.getByID(inventoryID);
        if (!item) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Inventory item not found",
                },
            };
        }
        await inventory_repository_1.default.update(inventoryID, {
            ...req.body,
            supplierId: req.body.supplierId
                ? new mongoose_1.default.Types.ObjectId(req.body.supplierId)
                : undefined,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Inventory updated successfully",
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
exports.updateInventory = updateInventory;
const removeInventory = async ({ req }) => {
    try {
        const { inventoryID } = req.params;
        const item = await inventory_repository_1.default.getByID(inventoryID);
        if (!item) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Inventory item not found",
                },
            };
        }
        await inventory_repository_1.default.delete(inventoryID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Inventory item deleted successfully",
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
exports.removeInventory = removeInventory;
exports.inventoryMutationHandler = {
    createInventory: exports.createInventory,
    updateInventory: exports.updateInventory,
    removeInventory: exports.removeInventory,
};
