"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventorySchema = exports.getAllInventorySchema = exports.getInventoryByIdSchema = exports.inventorySchema = exports.createInventorySchema = exports.inventoryUnitEnum = void 0;
const zod_1 = require("zod");
exports.inventoryUnitEnum = zod_1.z.enum([
    "kg",
    "gram",
    "liter",
    "ml",
    "pcs",
    "pack",
    "box",
    "bottle",
    "can",
    "tray",
    "dozen",
]);
exports.createInventorySchema = zod_1.z.object({
    sku: zod_1.z.string().min(1),
    name: zod_1.z.string().min(2).max(100),
    unit: exports.inventoryUnitEnum,
    currentStock: zod_1.z.number().optional(),
    minimumStock: zod_1.z.number().optional(),
    reorderLevel: zod_1.z.number().optional(),
    costPerUnit: zod_1.z.number(),
    supplierId: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    lastRestocked: zod_1.z.coerce.date().optional(),
    category: zod_1.z.string().min(1),
});
exports.inventorySchema = zod_1.z.object({
    _id: zod_1.z.string(),
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    unit: zod_1.z.string(),
    currentStock: zod_1.z.number(),
    minimumStock: zod_1.z.number(),
    reorderLevel: zod_1.z.number(),
    costPerUnit: zod_1.z.number(),
    supplierId: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    lastRestocked: zod_1.z.coerce.date().optional(),
    category: zod_1.z.string(),
});
exports.getInventoryByIdSchema = exports.inventorySchema;
exports.getAllInventorySchema = zod_1.z.array(exports.inventorySchema);
exports.updateInventorySchema = zod_1.z.object({
    sku: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
    unit: exports.inventoryUnitEnum.optional(),
    currentStock: zod_1.z.number().optional(),
    minimumStock: zod_1.z.number().optional(),
    reorderLevel: zod_1.z.number().optional(),
    costPerUnit: zod_1.z.number().optional(),
    supplierId: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    lastRestocked: zod_1.z.coerce.date().optional(),
    category: zod_1.z.string().optional(),
});
