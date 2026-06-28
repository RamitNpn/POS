"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemMutationHandler = exports.removeMenuItem = exports.updateMenuItem = exports.createMenuItem = void 0;
const menu_item_repository_1 = __importDefault(require("../../repository/menu-item-repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const createMenuItem = async ({ req }) => {
    try {
        console.log("[CREATE MENU ITEM] REQUEST BODY:", req.body);
        console.log("[CREATE MENU ITEM] FILES RAW:", req.files);
        const existing = await menu_item_repository_1.default.getByName(req.body.name);
        console.log("[CREATE MENU ITEM] EXISTING CHECK:", existing);
        if (existing) {
            console.log("[CREATE MENU ITEM] DUPLICATE ITEM:", req.body.name);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Item already exists",
                },
            };
        }
        const amount = Number(req.body.price);
        console.log("[CREATE MENU ITEM] PARSED PRICE:", amount);
        const files = req.files;
        console.log("[CREATE MENU ITEM] IMAGE FILE ARRAY:", files?.image);
        const profileUrl = files?.image?.[0]?.path || "";
        console.log("[CREATE MENU ITEM] IMAGE PATH:", profileUrl);
        console.log("[CREATE MENU ITEM] FINAL PAYLOAD:", {
            ...req.body,
            price: amount,
            image: profileUrl,
        });
        const menuItem = await menu_item_repository_1.default.create({
            ...req.body,
            categoryId: req.body.categoryId
                ? new mongoose_1.default.Types.ObjectId(req.body.categoryId)
                : undefined,
            image: profileUrl,
            price: amount,
        });
        console.log("[CREATE MENU ITEM] SUCCESS CREATED");
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Create",
            details: `${menuItem?.name} created at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "MenuItem",
            entityId: `${menuItem?._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Menu item created successfully",
            },
        };
    }
    catch (error) {
        console.error("[CREATE MENU ITEM] ERROR:", error);
        console.error("[CREATE MENU ITEM] REQUEST BODY:", req.body);
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
        console.log("[UPDATE MENU ITEM] PARAMS:", req.params);
        console.log("[UPDATE MENU ITEM] BODY:", req.body);
        console.log("[UPDATE MENU ITEM] FILES:", req.files);
        const item = await menu_item_repository_1.default.getByID(itemID);
        console.log("[UPDATE MENU ITEM] EXISTING ITEM:", item);
        if (!item) {
            console.log("[UPDATE MENU ITEM] NOT FOUND:", itemID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Item not found",
                },
            };
        }
        if (req.body.name && req.body.name !== item.name) {
            console.log("[UPDATE MENU ITEM] NAME CHANGE DETECTED");
            const exists = await menu_item_repository_1.default.getByName(req.body.name);
            console.log("[UPDATE MENU ITEM] NAME CHECK:", exists);
            if (exists) {
                console.log("[UPDATE MENU ITEM] DUPLICATE NAME:", req.body.name);
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
        console.log("[UPDATE MENU ITEM] PARSED PRICE:", amount);
        const files = req.files;
        const profileUrl = files?.image?.[0]?.path || "";
        console.log("[UPDATE MENU ITEM] IMAGE PATH:", profileUrl);
        console.log("[UPDATE MENU ITEM] FINAL UPDATE PAYLOAD:", {
            ...req.body,
            price: amount,
            image: profileUrl,
        });
        const updatePayload = {
            ...req.body,
            categoryId: req.body.categoryId
                ? new mongoose_1.default.Types.ObjectId(req.body.categoryId)
                : undefined,
            price: amount,
        };
        if (profileUrl) {
            updatePayload.image = profileUrl;
        }
        console.log("[UPDATE MENU ITEM] FINAL UPDATE PAYLOAD:", updatePayload);
        const menuItem = await menu_item_repository_1.default.update(itemID, updatePayload);
        console.log("[UPDATE MENU ITEM] SUCCESS UPDATED");
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `${menuItem?.name} updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "MenuItem",
            entityId: `${menuItem?._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu item updated successfully",
            },
        };
    }
    catch (error) {
        console.error("[UPDATE MENU ITEM] ERROR:", error);
        console.error("[UPDATE MENU ITEM] PARAMS:", req.params);
        console.error("[UPDATE MENU ITEM] BODY:", req.body);
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
        console.log("[DELETE MENU ITEM] PARAMS:", req.params);
        const item = await menu_item_repository_1.default.getByID(itemID);
        console.log("[DELETE MENU ITEM] EXISTING ITEM:", item);
        if (!item) {
            console.log("[DELETE MENU ITEM] NOT FOUND:", itemID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Item not found",
                },
            };
        }
        console.log("[DELETE MENU ITEM] DELETING ITEM...");
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `${item?.name} updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "MenuItem",
            entityId: `${item?._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        await menu_item_repository_1.default.delete(itemID);
        console.log("[DELETE MENU ITEM] SUCCESS DELETED");
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu item deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[DELETE MENU ITEM] ERROR:", error);
        console.error("[DELETE MENU ITEM] PARAMS:", req.params);
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
