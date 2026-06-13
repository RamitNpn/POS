import { initServer } from "@ts-rest/express";

import { userQueryHandler } from "./user.query";
import { userMutationHandler } from "./user.mutation";

import { userContract } from "../../contract/user/user.contract";

const s = initServer();

export const userRouter = s.router(userContract, {
  createUser: userMutationHandler.createUser,
  updateUser: userMutationHandler.updateUser,
  removeUser: userMutationHandler.removeUser,

  getAllUsers: userQueryHandler.getAllUsers,
  getUserByID: userQueryHandler.getUserByID,
});
