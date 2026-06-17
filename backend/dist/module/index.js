"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("@ts-rest/express");
const contract_1 = require("../contract");
const user_router_1 = require("./user/user.router");
const room_router_1 = require("./room/room.router");
const table_router_1 = require("./table/table.router");
const menu_category_router_1 = require("./menu-category/menu-category.router");
const menu_subcategory_router_1 = require("./menu-subcategory/menu-subcategory.router");
const menu_item_router_1 = require("./menu-item/menu-item.router");
const inventory_router_1 = require("./inventory/inventory.router");
const order_router_1 = __importDefault(require("./order/order.router"));
const ticket_router_1 = require("./ticket/ticket.router");
const s = (0, express_1.initServer)();
exports.router = s.router(contract_1.contract, {
    user: user_router_1.userRouter,
    room: room_router_1.roomRouter,
    table: table_router_1.tableRouter,
    menuCategory: menu_category_router_1.menuCategoryRouter,
    menuSubCategory: menu_subcategory_router_1.menuSubCategoryRouter,
    menuItem: menu_item_router_1.menuItemRouter,
    inventory: inventory_router_1.inventoryRouter,
    order: order_router_1.default,
    ticket: ticket_router_1.ticketRouter,
});
