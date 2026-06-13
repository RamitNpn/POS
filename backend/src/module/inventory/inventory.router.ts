import { initServer } from "@ts-rest/express";

import { inventoryContract } from "../../contract/inventory/inventory.contract";

import { inventoryMutationHandler } from "./inventory.mutation";
import { inventoryQueryHandler } from "./inventory.query";

const s = initServer();

export const inventoryRouter = s.router(inventoryContract, {
  createInventory: inventoryMutationHandler.createInventory,
  updateInventory: inventoryMutationHandler.updateInventory,
  removeInventory: inventoryMutationHandler.removeInventory,
  getAllInventory: inventoryQueryHandler.getAllInventory,
  getInventoryByID: inventoryQueryHandler.getInventoryByID,
});
