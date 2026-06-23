import { initServer } from "@ts-rest/express";

import { roleContract } from "../../contract/role/role.contract";
import { roleMutationHandler } from "./role.mutation";
import { roleQueryHandler } from "./role.query";

const s = initServer();

export const roleRouter = s.router(roleContract, {
  createRole: roleMutationHandler.createRole,
  updateRole: roleMutationHandler.updateRole,
  removeRole: roleMutationHandler.removeRole,

  getAllRoles: roleQueryHandler.getAllRoles,
  getRoleByID: roleQueryHandler.getRoleByID,
});