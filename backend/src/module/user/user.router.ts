import { initServer } from "@ts-rest/express";

import { userQueryHandler } from "./user.query";
import { userMutationHandler } from "./user.mutation";

import { userContract } from "../../contract/user/user.contract";
import { userUploadFields } from "../../middleware/cloudinary.middleware";
import {
  verifyToken,
  authorizeRoles,
  authorizeSelfOrAdmin,
} from "../../middleware/auth.middleware";
import { userAuthHandler } from "./user.auth";

const s = initServer();

export const userRouter = s.router(userContract, {
  login: userAuthHandler.login,
  logout: {
    middleware: [verifyToken],
    handler: userAuthHandler.logout,
  },
  getMe: {
    middleware: [verifyToken],
    handler: userAuthHandler.getMe,
  },
  // createUser: userMutationHandler.createUser,
  createUser: {
    middleware: [verifyToken, authorizeRoles("admin"), userUploadFields],
    handler: userMutationHandler.createUser,
  },
  getAllUsers: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: userQueryHandler.getAllUsers,
  },
  getUserByID: {
    middleware: [verifyToken, authorizeSelfOrAdmin("userID")],
    handler: userQueryHandler.getUserByID,
  },
  updateUser: {
    middleware: [verifyToken, authorizeSelfOrAdmin("userID"), userUploadFields],
    handler: userMutationHandler.updateUser,
  },
  removeUser: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: userMutationHandler.removeUser,
  },
});
