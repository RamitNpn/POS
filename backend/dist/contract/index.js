"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contract = void 0;
const core_1 = require("@ts-rest/core");
const user_contract_1 = require("./user/user.contract");
const room_contract_1 = require("./room/room.contract");
const table_contract_1 = require("./table/table.contract");
const menu_category_contract_1 = require("./menu-category/menu-category.contract");
const menu_item_contract_1 = require("./menu-item/menu-item.contract");
const order_contract_1 = require("./order/order.contract");
const ticket_contract_1 = require("./ticket/ticket.contract");
const stats_contract_1 = require("./stats/stats.contract");
const reservation_contract_1 = require("./reservation/reservation.contract");
const supplier_contract_1 = require("./supplier/supplier.contract");
const ingredient_contract_1 = require("./ingredient/ingredient.contract");
const purchase_contract_1 = require("./purchase/purchase.contract");
const stock_movement_contract_1 = require("./stock-movement/stock-movement.contract");
const expenses_contract_1 = require("./expenses/expenses.contract");
const auth_contract_1 = require("./auth/auth.contract");
const log_contract_1 = require("./logs/log.contract");
const report_contract_1 = require("./daily-report/report.contract");
const role_contract_1 = require("./role/role.contract");
const branch_contract_1 = require("./branch/branch.contract");
const sales_contract_1 = require("./sales/sales.contract");
const ledger_contract_1 = require("./ledger/ledger.contract");
const c = (0, core_1.initContract)();
exports.contract = c.router({
    auth: auth_contract_1.authContract,
    user: user_contract_1.userContract,
    room: room_contract_1.roomContract,
    table: table_contract_1.tableContract,
    menuCategory: menu_category_contract_1.menuCategoryContract,
    menuItem: menu_item_contract_1.menuItemContract,
    order: order_contract_1.orderContract,
    ticket: ticket_contract_1.ticketContract,
    stats: stats_contract_1.statsContract,
    reservation: reservation_contract_1.reservationContract,
    supplier: supplier_contract_1.supplierContract,
    ingredient: ingredient_contract_1.ingredientContract,
    purchase: purchase_contract_1.purchaseContract,
    stockMovement: stock_movement_contract_1.stockMovementContract,
    expenses: expenses_contract_1.expenseContract,
    logs: log_contract_1.activityLogContract,
    report: report_contract_1.reportContract,
    role: role_contract_1.roleContract,
    branch: branch_contract_1.branchContract,
    sales: sales_contract_1.salesContract,
    ledger: ledger_contract_1.ledgerContract,
});
