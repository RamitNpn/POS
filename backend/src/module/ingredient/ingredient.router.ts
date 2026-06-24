import { initServer } from "@ts-rest/express";

import { ingredientContract } from "../../contract/ingredient/ingredient.contract";

import { ingredientMutationHandler } from "./ingredient.mutation";
import { ingredientQueryHandler } from "./ingredient.query";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const ingredientRouter = s.router(ingredientContract, {
  createIngredient: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ingredientMutationHandler.createIngredient,
  },

  updateIngredient: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ingredientMutationHandler.updateIngredient,
  },

  deleteIngredient: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ingredientMutationHandler.deleteIngredient as any,
  },

  getAllIngredients: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ingredientQueryHandler.getAllIngredients,
  },

  getIngredientByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ingredientQueryHandler.getIngredientByID,
  },
});
