"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditLedgerRouter = void 0;
const express_1 = require("@ts-rest/express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const ledger_mutation_1 = require("../../module/ledger/ledger.mutation");
const ledger_query_1 = require("../../module/ledger/ledger.query");
const ledger_contract_1 = require("../../contract/ledger/ledger.contract");
const s = (0, express_1.initServer)();
exports.creditLedgerRouter = s.router(ledger_contract_1.ledgerContract, {
    createCreditLedger: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ledger_mutation_1.creditLedgerMutationHandler.createCreditLedger,
    },
    updateCreditLedger: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ledger_mutation_1.creditLedgerMutationHandler.updateCreditLedger,
    },
    deleteCreditLedger: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ledger_mutation_1.creditLedgerMutationHandler.deleteCreditLedger,
    },
    getAllCreditLedgers: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ledger_query_1.creditLedgerQueryHandler.getAllCreditLedgers,
    },
    getCreditLedgerByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ledger_query_1.creditLedgerQueryHandler.getCreditLedgerById,
    },
});
