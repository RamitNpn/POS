"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementRouter = void 0;
const express_1 = require("@ts-rest/express");
const stock_movement_contract_1 = require("../../contract/stock-movement/stock-movement.contract");
const stock_moment_query_1 = require("./stock-moment.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.stockMovementRouter = s.router(stock_movement_contract_1.stockMovementContract, {
    getAllStockMovements: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stock_moment_query_1.stockMovementQueryHandler.getAllStockMovements,
    },
    getByIngredient: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stock_moment_query_1.stockMovementQueryHandler.getByIngredient,
    },
});
