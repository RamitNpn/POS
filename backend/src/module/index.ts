import { initServer } from "@ts-rest/express";

import { contract } from "../contract";

import { userRouter } from "./user/user.router";
import { roomRouter } from "./room/room.router";
import { tableRouter } from "./table/table.router";
import { menuCategoryRouter } from "./menu-category/menu-category.router";
import { menuSubCategoryRouter } from "./menu-subcategory/menu-subcategory.router";
import { menuItemRouter } from "./menu-item/menu-item.router";
import { inventoryRouter } from "./inventory/inventory.router";
import orderRouter from "./order/order.router";

const s = initServer();

export const router = s.router(contract, {
  user: userRouter,
  room: roomRouter,
  table: tableRouter,
  menuCategory: menuCategoryRouter,
  menuSubCategory: menuSubCategoryRouter,
  menuItem: menuItemRouter,
  inventory: inventoryRouter,
  order: orderRouter,
});
