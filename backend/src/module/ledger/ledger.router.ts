import { initServer } from "@ts-rest/express";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";
import { creditLedgerMutationHandler } from "../../module/ledger/ledger.mutation";
import { creditLedgerQueryHandler } from "../../module/ledger/ledger.query";
import { ledgerContract } from "../../contract/ledger/ledger.contract";

const s = initServer();

export const creditLedgerRouter = s.router(ledgerContract, {
  createCreditLedger: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: creditLedgerMutationHandler.createCreditLedger,
  },

  updateCreditLedger: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: creditLedgerMutationHandler.updateCreditLedger,
  },

  deleteCreditLedger: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: creditLedgerMutationHandler.deleteCreditLedger as any,
  },

  getAllCreditLedgers: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: creditLedgerQueryHandler.getAllCreditLedgers,
  },

  getCreditLedgerByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: creditLedgerQueryHandler.getCreditLedgerById,
  },
});
