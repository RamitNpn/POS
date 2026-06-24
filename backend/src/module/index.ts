import { initServer } from "@ts-rest/express";

import { contract } from "../contract";

import { userRouter } from "./user/user.router";
import { roomRouter } from "./room/room.router";
import { tableRouter } from "./table/table.router";
import { menuCategoryRouter } from "./menu-category/menu-category.router";
import { menuItemRouter } from "./menu-item/menu-item.router";
import { ticketRouter } from "./ticket/ticket.router";
import { statsRouter } from "./stats/stats.router";
import { reservationRouter } from "./reservation/reservation.router";
import { supplierRouter } from "./supplier/supplier.router";
import { ingredientRouter } from "./ingredient/ingredient.router";
import { purchaseRouter } from "./purchase/purchase.router";
import { orderRouter } from "./order/order.router";
import { stockMovementRouter } from "./stock-movement/stock-movement.router";
import { expenseRouter } from "./expenses/expenses.router";
import { authRouter } from "./auth/auth.router";
import { activityLogRouter } from "./logs/log.router";
import { reportRouter } from "./daily-report/report.router";
import { roleRouter } from "./role/role.router";
import { branchRouter } from "./branch/branch.router";
import { salesRouter } from "./sales/sales.router";

const s = initServer();

export const router = s.router(contract, {
  auth: authRouter,
  user: userRouter,
  room: roomRouter,
  table: tableRouter,
  menuCategory: menuCategoryRouter,
  menuItem: menuItemRouter,
  order: orderRouter,
  ticket: ticketRouter,
  stats: statsRouter,
  reservation: reservationRouter,
  supplier: supplierRouter,
  ingredient: ingredientRouter,
  purchase: purchaseRouter,
  stockMovement: stockMovementRouter,
  expenses: expenseRouter,
  logs: activityLogRouter,
  report: reportRouter,
  role: roleRouter,
  branch: branchRouter,
  sales: salesRouter,
});
