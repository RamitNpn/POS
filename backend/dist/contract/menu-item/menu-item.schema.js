"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemSchema = exports.getMenuItemByIdSchema = exports.getAllMenuItemsSchema = exports.menuItemSchema = exports.createMenuItemSchema = exports.variantTypeEnum = exports.menuItemStatusEnum = void 0;
const zod_1 = require("zod");
exports.menuItemStatusEnum = zod_1.z.enum([
    "available",
    "out-of-stock",
]);
exports.variantTypeEnum = zod_1.z.enum([
    "ml",
    "veg",
    "non-veg",
    "chili",
    "fry",
    "boil",
]);
exports.createMenuItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    description: zod_1.z.string().min(5),
    price: zod_1.z.coerce.number(),
    categoryId: zod_1.z.string(),
    image: zod_1.z.any().optional(),
    status: exports.menuItemStatusEnum.optional(),
});
exports.menuItemSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    categoryId: zod_1.z.string(),
    image: zod_1.z.string().optional(),
    status: exports.menuItemStatusEnum,
});
exports.getAllMenuItemsSchema = zod_1.z.array(exports.menuItemSchema);
exports.getMenuItemByIdSchema = exports.menuItemSchema;
exports.updateMenuItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120).optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.coerce.number().optional(),
    categoryId: zod_1.z.string().optional(),
    image: zod_1.z.any().optional(),
    status: exports.menuItemStatusEnum.optional(),
});
