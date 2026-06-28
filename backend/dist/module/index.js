"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("@ts-rest/express");
const contract_1 = require("../contract");
const user_router_1 = require("./user/user.router");
const room_router_1 = require("./room/room.router");
const table_router_1 = require("./table/table.router");
const menu_category_router_1 = require("./menu-category/menu-category.router");
const menu_item_router_1 = require("./menu-item/menu-item.router");
const ticket_router_1 = require("./ticket/ticket.router");
const stats_router_1 = require("./stats/stats.router");
const reservation_router_1 = require("./reservation/reservation.router");
const supplier_router_1 = require("./supplier/supplier.router");
const ingredient_router_1 = require("./ingredient/ingredient.router");
const purchase_router_1 = require("./purchase/purchase.router");
const order_router_1 = require("./order/order.router");
const stock_movement_router_1 = require("./stock-movement/stock-movement.router");
const expenses_router_1 = require("./expenses/expenses.router");
const auth_router_1 = require("./auth/auth.router");
const log_router_1 = require("./logs/log.router");
const report_router_1 = require("./daily-report/report.router");
const role_router_1 = require("./role/role.router");
const branch_router_1 = require("./branch/branch.router");
const sales_router_1 = require("./sales/sales.router");
const ledger_router_1 = require("./ledger/ledger.router");
const s = (0, express_1.initServer)();
exports.router = s.router(contract_1.contract, {
    auth: auth_router_1.authRouter,
    user: user_router_1.userRouter,
    room: room_router_1.roomRouter,
    table: table_router_1.tableRouter,
    menuCategory: menu_category_router_1.menuCategoryRouter,
    menuItem: menu_item_router_1.menuItemRouter,
    order: order_router_1.orderRouter,
    ticket: ticket_router_1.ticketRouter,
    stats: stats_router_1.statsRouter,
    reservation: reservation_router_1.reservationRouter,
    supplier: supplier_router_1.supplierRouter,
    ingredient: ingredient_router_1.ingredientRouter,
    purchase: purchase_router_1.purchaseRouter,
    stockMovement: stock_movement_router_1.stockMovementRouter,
    expenses: expenses_router_1.expenseRouter,
    logs: log_router_1.activityLogRouter,
    report: report_router_1.reportRouter,
    role: role_router_1.roleRouter,
    branch: branch_router_1.branchRouter,
    sales: sales_router_1.salesRouter,
    ledger: ledger_router_1.creditLedgerRouter,
});
