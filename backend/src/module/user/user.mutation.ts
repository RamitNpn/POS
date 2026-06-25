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
    const { name, email, role, phone, status } = req.body;

    console.log("[createUser] request:", {
      name,
      email,
      role,
      phone,
      status,
    });

    const existingUser = await userRepository.getByEmail(email.toLowerCase());

    console.log("[createUser] existing user:", existingUser);

    if (existingUser) {
      console.log("[createUser] email already exists:", email);

      return {
        status: 400,
        body: {
          success: false,
          error: "Email already exists",
          message: "Email already exist",
        },
      };
    }

    console.log("[createUser] hashing password");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    console.log("[createUser] uploaded files:", files);

    const profileUrl = files?.profile?.[0]?.path || "";

    console.log("[createUser] profile url:", profileUrl);

    const created = await userRepository.create({
      name,
      email: email.toLowerCase(),
      role,
      profile: profileUrl,
      password: hashedPassword,
      phone,
      status,
    });

    console.log("[createUser] created user:", {
      id: created?._id,
      email: created?.email,
      role: created?.role,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "User created successfully",
      },
    };
  } catch (error) {
    console.error("[createUser] error:", error);

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

    console.log("[updateUser] userID:", userID);

    const existingUser = await userRepository.getByID(userID);

    console.log("[updateUser] existing user:", existingUser);

    if (!existingUser) {
      console.log("[updateUser] user not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const { name, email, role, password, phone, status } = req.body;

    console.log("[updateUser] payload:", {
      name,
      email,
      role,
      phone,
      status,
      passwordProvided: !!password,
    });

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    console.log("[updateUser] uploaded files:", files);

    const profileUrl = files?.profile?.[0]?.path;

    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;
    if (profileUrl !== undefined) updateData.profile = profileUrl;

    if (password) {
      console.log("[updateUser] hashing new password");
      updateData.password = await bcrypt.hash(password, 10);
    }

    console.log("[updateUser] final updateData:", {
      ...updateData,
      password: updateData.password ? "[HASHED]" : undefined,
    });

    const updated = await userRepository.update(userID, updateData);

    console.log("[updateUser] updated user:", updated);

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
    console.error("[updateUser] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeUser: AppRouteMutationImplementation<
  typeof userContract.removeUser
> = async ({ req }) => {
  try {
    const { userID } = req.params;

    console.log("[removeUser] userID:", userID);

    const existingUser = await userRepository.getByID(userID);

    console.log("[removeUser] existing user:", existingUser);

    if (!existingUser) {
      console.log("[removeUser] user not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const deleted = await userRepository.delete(userID);

    console.log("[removeUser] delete result:", deleted);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User could not be deleted",
        },
      };
    }

    console.log("[removeUser] user deleted successfully");

    return {
      status: 200,
      body: {
        success: true,
        message: "User deleted successfully",
      },
    };
  } catch (error) {
    console.error("[removeUser] error:", error);

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
