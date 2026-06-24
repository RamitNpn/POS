import { initServer } from "@ts-rest/express";
import { supplierContract } from "../../contract/supplier/supplier.contract";
import { supplierMutationHandler } from "./supplier.mutation";
import { supplierQueryHandler } from "./supplier.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const supplierRouter = s.router(supplierContract, {
  createSupplier: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: supplierMutationHandler.createSupplier,
  },

  updateSupplier: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: supplierMutationHandler.updateSupplier,
  },

  deleteSupplier: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: supplierMutationHandler.deleteSupplier as any,
  },

  getAllSuppliers: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: supplierQueryHandler.getAllSuppliers,
  },

  getSupplierByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: supplierQueryHandler.getSupplierByID,
  },
});
