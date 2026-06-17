"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuCategorySchema = exports.getAllMenuCategoriesSchema = exports.getMenuCategoryByIdSchema = exports.menuCategorySchema = exports.createMenuCategorySchema = void 0;
const zod_1 = require("zod");
exports.createMenuCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    description: zod_1.z.string().optional(),
});
exports.menuCategorySchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    itemCount: zod_1.z.number().optional(),
    createdAt: zod_1.z.date().optional(),
});
exports.getMenuCategoryByIdSchema = exports.menuCategorySchema;
exports.getAllMenuCategoriesSchema = zod_1.z.array(exports.menuCategorySchema);
exports.updateMenuCategorySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100).optional(),
    description: zod_1.z.string().optional(),
});
