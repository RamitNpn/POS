"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemMutationHandler = exports.removeMenuItem = exports.updateMenuItem = exports.createMenuItem = void 0;
const menu_item_repository_1 = __importDefault(require("../../repository/menu-item-repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createMenuItem = async ({ req }) => {
    try {
        const existing = await menu_item_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Item already exists",
                },
            };
        }
        const amount = Number(req.body.price);
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        const files = req.files;
        console.log("IMAGE:", files?.image?.[0]);
        const profileUrl = files?.image?.[0]?.path || "";
        await menu_item_repository_1.default.create({
            ...req.body,
            categoryId: req.body.categoryId
                ? new mongoose_1.default.Types.ObjectId(req.body.categoryId)
                : undefined,
            image: profileUrl,
            price: amount,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Menu item created successfully",
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
exports.createMenuItem = createMenuItem;
const updateMenuItem = async ({ req }) => {
    try {
        const { itemID } = req.params;
        const item = await menu_item_repository_1.default.getByID(itemID);
        if (!item) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Item not found",
                },
            };
        }
        if (req.body.name && req.body.name !== item.name) {
            const exists = await menu_item_repository_1.default.getByName(req.body.name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Item already exists",
                    },
                };
            }
        }
        const amount = Number(req.body.price);
        const files = req.files;
        const profileUrl = files?.image?.[0]?.path || "";
        await menu_item_repository_1.default.update(itemID, {
            ...req.body,
            categoryId: req.body.categoryId
                ? new mongoose_1.default.Types.ObjectId(req.body.categoryId)
                : undefined,
            image: profileUrl,
            price: amount,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu item updated successfully",
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
exports.updateMenuItem = updateMenuItem;
const removeMenuItem = async ({ req }) => {
    try {
        const { itemID } = req.params;
        const item = await menu_item_repository_1.default.getByID(itemID);
        if (!item) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Item not found",
                },
            };
        }
        await menu_item_repository_1.default.delete(itemID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu item deleted successfully",
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
exports.removeMenuItem = removeMenuItem;
exports.menuItemMutationHandler = {
    createMenuItem: exports.createMenuItem,
    updateMenuItem: exports.updateMenuItem,
    removeMenuItem: exports.removeMenuItem,
};
