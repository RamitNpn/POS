import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../commonSchema";
import { createCreditLedgerSchema, getAllCreditLedgerSchema, getCreditLedgerByIdSchema, LedgerType, updateCreditLedgerSchema } from "./ledger.schema";

const c = initContract();

export const ledgerContract = c.router({
  createCreditLedger: {
    method: "POST",
    path: "/ledger",
    summary: "Create a new credit ledger entry",
    body: createCreditLedgerSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllCreditLedgers: {
    method: "GET",
    path: "/ledger",
    summary:
      "Get a paginated list of credit ledger entries with optional filters",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      type: LedgerType.optional(),
      customerPhone: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllCreditLedgerSchema,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
    },
  },

  getCreditLedgerByID: {
    method: "GET",
    path: "/ledger/:ledgerID",
    summary: "Get credit ledger details by ID",
    pathParams: z.object({
      ledgerID: z.string(),
    }),
    responses: {
      200: getCreditLedgerByIdSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateCreditLedger: {
    method: "PUT",
    path: "/ledger/:ledgerID",
    summary: "Update credit ledger entry",
    pathParams: z.object({
      ledgerID: z.string(),
    }),
    body: updateCreditLedgerSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  deleteCreditLedger: {
    method: "DELETE",
    path: "/ledger/:ledgerID",
    summary: "Delete credit ledger entry",
    pathParams: z.object({
      ledgerID: z.string(),
    }),
    body: z.object({}).optional(),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});