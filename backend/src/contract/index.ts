import { initContract } from "@ts-rest/core";
import { userContract } from "./user/user.contract";
import { roomContract } from "./room/room.contract";
import { tableContract } from "./table/table.contract";
import { menuCategoryContract } from "./menu-category/menu-category.contract";
import { menuSubCategoryContract } from "./menu-subcategory/menu-subcategory.contract";
import { menuItemContract } from "./menu-item/menu-item.contract";
import { orderContract } from "./order/order.contract";
import { ticketContract } from "./ticket/ticket.contract";
import { statsContract } from "./stats/stats.contract";
import { reservationContract } from "./reservation/reservation.contract";
import { supplierContract } from "./supplier/supplier.contract";
import { ingredientContract } from "./ingredient/ingredient.contract";
import { purchaseContract } from "./purchase/purchase.contract";
import { stockMovementContract } from "./stock-movement/stock-movement.contract";
import { expenseContract } from "./expenses/expenses.contract";
import { authContract } from "./auth/auth.contract";
import { activityLogContract } from "./logs/log.contract";
import { reportContract } from "./daily-report/report.contract";

const c = initContract();

export const contract = c.router({
    auth: authContract,
    user: userContract,
    room: roomContract,
    table: tableContract,
    menuCategory: menuCategoryContract,
    menuSubCategory: menuSubCategoryContract,
    menuItem: menuItemContract,
    order: orderContract,
    ticket: ticketContract,
    stats: statsContract,
    reservation: reservationContract,
    supplier: supplierContract,
    ingredient: ingredientContract,
    purchase: purchaseContract,
    stockMovement: stockMovementContract,
    expenses: expenseContract,
    logs: activityLogContract,
    report: reportContract,
});
