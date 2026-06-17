"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contract = void 0;
const core_1 = require("@ts-rest/core");
const user_contract_1 = require("./user/user.contract");
const room_contract_1 = require("./room/room.contract");
const table_contract_1 = require("./table/table.contract");
const menu_category_contract_1 = require("./menu-category/menu-category.contract");
const menu_subcategory_contract_1 = require("./menu-subcategory/menu-subcategory.contract");
const menu_item_contract_1 = require("./menu-item/menu-item.contract");
const inventory_contract_1 = require("./inventory/inventory.contract");
const order_contract_1 = require("./order/order.contract");
const ticket_contract_1 = require("./ticket/ticket.contract");
const c = (0, core_1.initContract)();
exports.contract = c.router({
    user: user_contract_1.userContract,
    room: room_contract_1.roomContract,
    table: table_contract_1.tableContract,
    menuCategory: menu_category_contract_1.menuCategoryContract,
    menuSubCategory: menu_subcategory_contract_1.menuSubCategoryContract,
    menuItem: menu_item_contract_1.menuItemContract,
    inventory: inventory_contract_1.inventoryContract,
    order: order_contract_1.orderContract,
    ticket: ticket_contract_1.ticketContract,
});
