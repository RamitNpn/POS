"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRouter = void 0;
const express_1 = require("@ts-rest/express");
const inventory_contract_1 = require("../../contract/inventory/inventory.contract");
const inventory_mutation_1 = require("./inventory.mutation");
const inventory_query_1 = require("./inventory.query");
const s = (0, express_1.initServer)();
exports.inventoryRouter = s.router(inventory_contract_1.inventoryContract, {
    createInventory: inventory_mutation_1.inventoryMutationHandler.createInventory,
    updateInventory: inventory_mutation_1.inventoryMutationHandler.updateInventory,
    removeInventory: inventory_mutation_1.inventoryMutationHandler.removeInventory,
    getAllInventory: inventory_query_1.inventoryQueryHandler.getAllInventory,
    getInventoryByID: inventory_query_1.inventoryQueryHandler.getInventoryByID,
});
