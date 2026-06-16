import { initContract } from "@ts-rest/core";
import { userContract } from "./user/user.contract";
import { roomContract } from "./room/room.contract";
import { tableContract } from "./table/table.contract";
import { menuCategoryContract } from "./menu-category/menu-category.contract";
import { menuSubCategoryContract } from "./menu-subcategory/menu-subcategory.contract";
import { menuItemContract } from "./menu-item/menu-item.contract";
import { inventoryContract } from "./inventory/inventory.contract";
import { orderContract } from "./order/order.contract";
import { ticketContract } from "./ticket/ticket.contract";

const c = initContract();

export const contract = c.router({
    user: userContract,
    room: roomContract,
    table: tableContract,
    menuCategory: menuCategoryContract,
    menuSubCategory: menuSubCategoryContract,
    menuItem: menuItemContract,
    inventory: inventoryContract,
    order: orderContract,
    ticket: ticketContract,
});
