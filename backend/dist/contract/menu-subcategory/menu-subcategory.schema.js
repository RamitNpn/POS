"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuSubCategorySchema = exports.getMenuSubCategoryByIdSchema = exports.getAllMenuSubCategoriesSchema = exports.menuSubCategorySchema = exports.createMenuSubCategorySchema = void 0;
const zod_1 = require("zod");
exports.createMenuSubCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().min(1),
    categoryName: zod_1.z.string().min(1),
    itemCount: zod_1.z.number().optional(),
});
exports.menuSubCategorySchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string(),
    categoryName: zod_1.z.string(),
    itemCount: zod_1.z.number().optional(),
});
exports.getAllMenuSubCategoriesSchema = zod_1.z.array(exports.menuSubCategorySchema);
exports.getMenuSubCategoryByIdSchema = exports.menuSubCategorySchema;
exports.updateMenuSubCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().optional(),
    categoryName: zod_1.z.string().optional(),
    itemCount: zod_1.z.number().optional(),
});
