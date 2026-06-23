"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = require("@ts-rest/express");
const role_contract_1 = require("../../contract/role/role.contract");
const role_mutation_1 = require("./role.mutation");
const role_query_1 = require("./role.query");
const s = (0, express_1.initServer)();
exports.roleRouter = s.router(role_contract_1.roleContract, {
    createRole: role_mutation_1.roleMutationHandler.createRole,
    updateRole: role_mutation_1.roleMutationHandler.updateRole,
    removeRole: role_mutation_1.roleMutationHandler.removeRole,
    getAllRoles: role_query_1.roleQueryHandler.getAllRoles,
    getRoleByID: role_query_1.roleQueryHandler.getRoleByID,
});
