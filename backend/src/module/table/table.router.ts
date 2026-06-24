import { initServer } from "@ts-rest/express";

import { tableContract } from "../../contract/table/table.contract";

import { tableMutationHandler } from "./table.mutation";
import { tableQueryHandler } from "./table.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const tableRouter = s.router(tableContract, {
  createTable: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: tableMutationHandler.createTable,
  },

  updateTable: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: tableMutationHandler.updateTable,
  },

  updateTableStatus: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: tableMutationHandler.updateTableStatus,
  },

  removeTable: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: tableMutationHandler.removeTable as any,
  },

  getAllTables: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: tableQueryHandler.getAllTables,
  },

  getTableByID: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: tableQueryHandler.getTableByID,
  },
});
