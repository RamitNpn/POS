import { initServer } from "@ts-rest/express";

import { stockMovementContract } from "../../contract/stock-movement/stock-movement.contract";
import { stockMovementQueryHandler } from "./stock-moment.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const stockMovementRouter = s.router(stockMovementContract, {
  getAllStockMovements: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: stockMovementQueryHandler.getAllStockMovements,
  },

  getByIngredient: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: stockMovementQueryHandler.getByIngredient,
  },
});
