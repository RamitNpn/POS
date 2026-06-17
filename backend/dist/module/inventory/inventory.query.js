"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryQueryHandler = exports.getInventoryByID = exports.getAllInventory = void 0;
const inventory_repository_1 = __importDefault(require("../../repository/inventory.repository"));
const getAllInventory = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await inventory_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            category: req.query.category,
        });
        return {
            status: 200,
            body: {
                data: data.map((item) => ({
                    _id: item._id.toString(),
                    sku: item.sku,
                    name: item.name,
                    unit: item.unit,
                    currentStock: item.currentStock,
                    minimumStock: item.minimumStock,
                    reorderLevel: item.reorderLevel,
                    costPerUnit: item.costPerUnit,
                    supplierId: item.supplierId?.toString(),
                    expiryDate: item.expiryDate,
                    lastRestocked: item.lastRestocked,
                    category: item.category,
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
                error: "Failed to fetch inventory",
            },
        };
    }
};
exports.getAllInventory = getAllInventory;
const getInventoryByID = async ({ req }) => {
    const item = await inventory_repository_1.default.getByID(req.params.inventoryID);
    if (!item) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Inventory item not found",
            },
        };
    }
    return {
        status: 200,
        body: {
            _id: item._id.toString(),
            sku: item.sku,
            name: item.name,
            unit: item.unit,
            currentStock: item.currentStock,
            minimumStock: item.minimumStock,
            reorderLevel: item.reorderLevel,
            costPerUnit: item.costPerUnit,
            supplierId: item.supplierId?.toString(),
            expiryDate: item.expiryDate,
            lastRestocked: item.lastRestocked,
            category: item.category,
        },
    };
};
exports.getInventoryByID = getInventoryByID;
exports.inventoryQueryHandler = {
    getAllInventory: exports.getAllInventory,
    getInventoryByID: exports.getInventoryByID,
};
