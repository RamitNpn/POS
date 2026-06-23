import { initServer } from "@ts-rest/express";

import {
  verifyToken,
} from "../../middleware/auth.middleware";
import { authContract } from "../../contract/auth/auth.contract";
import { authMutationHandler } from "./auth.mutation";
import { authQueryHandler } from "./auth.query";

const s = initServer();

export const authRouter = s.router(authContract, {
  login: authMutationHandler.login,
  logout: {
    middleware: [verifyToken],
    handler: authMutationHandler.logout,
  },
  getMe: {
    middleware: [verifyToken],
    handler: authQueryHandler.getMe,
  },
});
