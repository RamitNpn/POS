import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  AppRouteMutationImplementation,
  AppRouteQueryImplementation,
} from "@ts-rest/express";
import env from "../../config/env";
import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";

const createToken = (user: {
  id: string;
  email: string;
  role: string;
  name: string;
}) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );
};

export const login: AppRouteMutationImplementation<
  typeof userContract.login
> = async ({ req, res }) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.getByEmail(email.toLowerCase(), true);

    if (!user) {
      return {
        status: 401,
        body: {
          success: false,
          error: "Invalid email or password.",
        },
      };
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return {
        status: 401,
        body: {
          success: false,
          error: "Invalid email or password.",
        },
      };
    }

    if (user.status !== "active") {
      return {
        status: 403,
        body: {
          success: false,
          error: "Your account is not active.",
        },
      };
    }

    const userId = user._id.toString();

    const token = createToken({
      id: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Logged in successfully.",
        user: {
          _id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to login.",
      },
    };
  }
};

export const logout: AppRouteMutationImplementation<
  typeof userContract.logout
> = async ({ res }) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Logged out successfully.",
    },
  };
};

export const getMe: AppRouteQueryImplementation<
  typeof userContract.getMe
> = async ({ req }) => {
  if (!req.user) {
    return {
      status: 401,
      body: {
        success: false,
        error: "Not authenticated.",
      },
    };
  }

  const user = await userRepository.getByID(req.user.id);

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

export const userAuthHandler = {
  login,
  logout,
  getMe,
};
