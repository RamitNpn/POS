import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";
import {
  AppRouteMutationImplementation,
  AppRouteQueryImplementation,
} from "@ts-rest/express";
import bcrypt from "bcryptjs";

const createUser: AppRouteMutationImplementation<
  typeof userContract.createUser
> = async ({ req }) => {
  try {
    const { name, email, role, password, phone, status } = req.body;
    console.log("BODY:", req.body);
console.log("FILES:", req.files);

    const existingUser = await userRepository.getByEmail(email.toLowerCase());

    if (existingUser) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Email already exists",
          message: "Email already exist",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profileUrl = files?.profile?.[0]?.path || "";

    const created = await userRepository.create({
      name,
      email: email.toLowerCase(),
      role,
      profile: profileUrl,
      password: hashedPassword,
      phone,
      status,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "User created successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateUser: AppRouteMutationImplementation<
  typeof userContract.updateUser
> = async ({ req }) => {
  try {
    const { userID } = req.params;

    const existingUser = await userRepository.getByID(userID);

    if (!existingUser) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const { name, email, role, password, phone, status } = req.body;

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profileUrl = files?.profile?.[0]?.path;

    const updateData: Record<string, any> = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (profileUrl) updateData.profile = profileUrl;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await userRepository.update(userID, updateData);

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "User updated successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeUser: AppRouteQueryImplementation<
  typeof userContract.removeUser
> = async ({ req }) => {
  try {
    const { userID } = req.params;

    const existingUser = await userRepository.getByID(userID);

    if (!existingUser) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const deleted = await userRepository.delete(userID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User could not be deleted",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "User deleted successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const userMutationHandler = {
  createUser,
  updateUser,
  removeUser,
};
