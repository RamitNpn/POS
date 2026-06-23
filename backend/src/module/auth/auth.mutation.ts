import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppRouteMutationImplementation } from "@ts-rest/express";
import env from "../../config/env";
import userRepository from "../../repository/user.repository";
import { authContract } from "../../contract/auth/auth.contract";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

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
  typeof authContract.login
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

    await logRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      action: "User Login",
      details: `${user.name} logged in at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Auth",
      entityId: "",
      entityType: "",
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
  typeof authContract.logout
> = async ({ req, res }) => { 

  const userId = req.user?.id;

  const user = await userRepository.getByID(userId || "");

  if (!user) {
    return {
      status: 401,
      body: {
        success: false,
        error: "User not found.",
      },
    };
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  await logRepository.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: "User Log Out",
    details: `${user.name} logged out at ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
    })}`,
    module: "Auth",
    entityId: "",
    entityType: "",
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Logged out successfully.",
    },
  };
};

export const authMutationHandler = {
  login,
  logout,
};
