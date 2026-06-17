"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemQueryHandler = exports.getMenuItemByID = exports.getAllMenuItems = void 0;
const menu_item_repository_1 = __importDefault(require("../../repository/menu-item-repository"));
const getAllMenuItems = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await menu_item_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
        });
        return {
            status: 200,
            body: {
                data: data.map((item) => ({
                    _id: item._id.toString(),
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    categoryId: item.categoryId.toString(),
                    image: item.image,
                    status: item.status,
                    createdAt: item.createdAt,
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
                error: "Failed to fetch menu items",
            },
        };
    }
};
exports.getAllMenuItems = getAllMenuItems;
const getMenuItemByID = async ({ req }) => {
    const item = await menu_item_repository_1.default.getByID(req.params.itemID);
    if (!item) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Item not found",
            },
        };
    }
    return {
        status: 200,
        body: {
            _id: item._id.toString(),
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: item.categoryId.toString(),
            image: item.image,
            status: item.status,
            createdAt: item.createdAt,
        },
    };
};
exports.getMenuItemByID = getMenuItemByID;
exports.menuItemQueryHandler = {
    getAllMenuItems: exports.getAllMenuItems,
    getMenuItemByID: exports.getMenuItemByID,
};
