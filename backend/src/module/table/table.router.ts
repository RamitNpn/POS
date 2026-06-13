import { initServer } from "@ts-rest/express";

import { tableContract } from "../../contract/table/table.contract";

import { tableMutationHandler } from "./table.mutation";
import { tableQueryHandler } from "./table.query";

const s = initServer();

export const tableRouter = s.router(tableContract, {
  createTable: tableMutationHandler.createTable,
  updateTable: tableMutationHandler.updateTable,
  removeTable: tableMutationHandler.removeTable,

  getAllTables: tableQueryHandler.getAllTables,
  getTableByID: tableQueryHandler.getTableByID,
});
