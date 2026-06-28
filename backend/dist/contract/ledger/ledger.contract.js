"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const ledger_schema_1 = require("./ledger.schema");
const c = (0, core_1.initContract)();
exports.ledgerContract = c.router({
    createCreditLedger: {
        method: "POST",
        path: "/ledger",
        summary: "Create a new credit ledger entry",
        body: ledger_schema_1.createCreditLedgerSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllCreditLedgers: {
        method: "GET",
        path: "/ledger",
        summary: "Get a paginated list of credit ledger entries with optional filters",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            type: ledger_schema_1.LedgerType.optional(),
            customerPhone: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: ledger_schema_1.getAllCreditLedgerSchema,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getCreditLedgerByID: {
        method: "GET",
        path: "/ledger/:ledgerID",
        summary: "Get credit ledger details by ID",
        pathParams: zod_1.z.object({
            ledgerID: zod_1.z.string(),
        }),
        responses: {
            200: ledger_schema_1.getCreditLedgerByIdSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    updateCreditLedger: {
        method: "PUT",
        path: "/ledger/:ledgerID",
        summary: "Update credit ledger entry",
        pathParams: zod_1.z.object({
            ledgerID: zod_1.z.string(),
        }),
        body: ledger_schema_1.updateCreditLedgerSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    deleteCreditLedger: {
        method: "DELETE",
        path: "/ledger/:ledgerID",
        summary: "Delete credit ledger entry",
        pathParams: zod_1.z.object({
            ledgerID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}).optional(),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
