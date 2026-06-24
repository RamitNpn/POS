import { initServer } from "@ts-rest/express";

import { purchaseContract } from "../../contract/purchase/purchase.contract";
import { purchaseMutationHandler } from "./purchase.mutation";
import { purchaseQueryHandler } from "./purchase.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const purchaseRouter = s.router(purchaseContract, {
  createPurchase: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: purchaseMutationHandler.createPurchase,
  },

  deletePurchase: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: purchaseMutationHandler.deletePurchase as any,
  },

  getAllPurchases: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: purchaseQueryHandler.getAllPurchases,
  },

  getPurchaseByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: purchaseQueryHandler.getPurchaseByID,
  },
});
