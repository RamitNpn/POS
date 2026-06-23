"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("@ts-rest/express");
const user_query_1 = require("./user.query");
const user_mutation_1 = require("./user.mutation");
const user_contract_1 = require("../../contract/user/user.contract");
const cloudinary_middleware_1 = require("../../middleware/cloudinary.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.userRouter = s.router(user_contract_1.userContract, {
    createUser: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin"), cloudinary_middleware_1.userUploadFields],
        handler: user_mutation_1.userMutationHandler.createUser,
    },
    getAllUsers: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: user_query_1.userQueryHandler.getAllUsers,
    },
    getUserByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeSelfOrAdmin)("userID")],
        handler: user_query_1.userQueryHandler.getUserByID,
    },
    updateUser: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeSelfOrAdmin)("userID"), cloudinary_middleware_1.userUploadFields],
        handler: user_mutation_1.userMutationHandler.updateUser,
    },
    removeUser: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: user_mutation_1.userMutationHandler.removeUser,
    },
});
