import { initServer } from "@ts-rest/express";

import { roleContract } from "../../contract/role/role.contract";
import { roleMutationHandler } from "./role.mutation";
import { roleQueryHandler } from "./role.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const roleRouter = s.router(roleContract, {
  createRole: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roleMutationHandler.createRole,
  },

  updateRole: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roleMutationHandler.updateRole,
  },

  removeRole: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roleMutationHandler.removeRole as any,
  },

  getAllRoles: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roleQueryHandler.getAllRoles,
  },

  getRoleByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roleQueryHandler.getRoleByID,
  },
});
