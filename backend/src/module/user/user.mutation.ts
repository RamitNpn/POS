import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";
import { AppRouteMutationImplementation } from "@ts-rest/express";

const createUser: AppRouteMutationImplementation<
  typeof userContract.createUser
> = async ({ req }) => {
  try {
    const { name, email, role, phone, status } = req.body;

    const existingUser = await userRepository.getByEmail(email.toLowerCase());

    if (existingUser) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Email already exists",
        },
      };
    }

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profileUrl = files?.profile?.[0]?.path || "";

    const created = await userRepository.create({
      name,
      email: email.toLowerCase(),
      role,
      profile: profileUrl,
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

    const { name, email, role, phone, status } = req.body;

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

    if (email && email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailExists = await userRepository.getByEmail(email.toLowerCase());

      if (emailExists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Email already exists",
          },
        };
      }
    }
    
    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profileUrl = files?.profile?.[0]?.path;

    const updateData: any = {
      name,
      email: email?.toLowerCase(),
      role,
      phone,
      status,
    };

    if (profileUrl) {
      updateData.profile = profileUrl;
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

export const removeUser: AppRouteMutationImplementation<
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
