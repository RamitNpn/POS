"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierRouter = void 0;
const express_1 = require("@ts-rest/express");
const supplier_contract_1 = require("../../contract/supplier/supplier.contract");
const supplier_mutation_1 = require("./supplier.mutation");
const supplier_query_1 = require("./supplier.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.supplierRouter = s.router(supplier_contract_1.supplierContract, {
    createSupplier: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: supplier_mutation_1.supplierMutationHandler.createSupplier,
    },
    updateSupplier: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: supplier_mutation_1.supplierMutationHandler.updateSupplier,
    },
    deleteSupplier: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: supplier_mutation_1.supplierMutationHandler.deleteSupplier,
    },
    getAllSuppliers: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: supplier_query_1.supplierQueryHandler.getAllSuppliers,
    },
    getSupplierByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: supplier_query_1.supplierQueryHandler.getSupplierByID,
    },
});
