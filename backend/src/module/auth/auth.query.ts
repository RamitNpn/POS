import { AppRouteQueryImplementation } from "@ts-rest/express";
import userRepository from "../../repository/user.repository";
import { authContract } from "../../contract/auth/auth.contract";

export const getMe: AppRouteQueryImplementation<
  typeof authContract.getMe
> = async ({ req }) => {
  if (!req.user) {
    console.log("Req user: ", req.user);
    return {
      status: 401,
      body: {
        success: false,
        error: "Not authenticated.",
      },
    };
  }

  const user = await userRepository.getByID(req.user.id);
  console.log("Requested user details: ", user);

  if (!user) {
    return {
      status: 401,
      body: {
        success: false,
        error: "Authenticated user not found.",
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      },
    },
  };
};

export const authQueryHandler = {
  getMe,
};
