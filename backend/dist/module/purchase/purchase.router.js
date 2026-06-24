"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseRouter = void 0;
const express_1 = require("@ts-rest/express");
const purchase_contract_1 = require("../../contract/purchase/purchase.contract");
const purchase_mutation_1 = require("./purchase.mutation");
const purchase_query_1 = require("./purchase.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.purchaseRouter = s.router(purchase_contract_1.purchaseContract, {
    createPurchase: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: purchase_mutation_1.purchaseMutationHandler.createPurchase,
    },
    deletePurchase: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: purchase_mutation_1.purchaseMutationHandler.deletePurchase,
    },
    getAllPurchases: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: purchase_query_1.purchaseQueryHandler.getAllPurchases,
    },
    getPurchaseByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: purchase_query_1.purchaseQueryHandler.getPurchaseByID,
    },
});
