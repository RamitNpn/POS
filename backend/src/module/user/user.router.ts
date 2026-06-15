import { initServer } from "@ts-rest/express";

import { userQueryHandler } from "./user.query";
import { userMutationHandler } from "./user.mutation";

import { userContract } from "../../contract/user/user.contract";
import { userUploadFields } from "../../middleware/cloudinary.middleware";

const s = initServer();

export const userRouter = s.router(userContract, {
  createUser: {
    middleware: [userUploadFields],
    handler: userMutationHandler.createUser,
  },

  updateUser: {
    middleware: [userUploadFields],
    handler: userMutationHandler.updateUser,
  },

  removeUser: userMutationHandler.removeUser,

  getAllUsers: userQueryHandler.getAllUsers,
  getUserByID: userQueryHandler.getUserByID,
});
