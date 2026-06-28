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
    console.log("Login Credintials: ", email, password);
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
      console.log("Invalid password no matched");
      return {
        status: 401,
        body: {
          success: false,
          error: "Invalid email or password.",
        },
      };
    }

    if (user.status !== "active") {
      console.log("Your account is not active");
      return {
        status: 403,
        body: {
          success: false,
          error: "Your account is not active.",
        },
      };
    }

    const userId = user._id.toString();
    console.log("User ID to generate token", userId);

    const token = createToken({
      id: userId,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    console.log("Generated token", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 8 * 60 * 60 * 1000,
    });

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      action: "Login",
      details: `${user.name} logged in at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Auth",
      entityId: `${userId}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

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

  console.log("User ID from params", userId);

  const user = await userRepository.getByID(userId || "");
  console.log("User by ID details", user);

  if (!user) {
    console.log("User ID not found");
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
    sameSite: "none",
  });

  const log = await logRepository.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: "LogOut",
    details: `${user.name} logged out at ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
    })}`,
    module: "Auth",
    entityId: `${userId}`,
    entityType: "",
  });

  if (!log) {
    console.log("User log not created", log);
  }

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
