import { AppRouteQueryImplementation } from "@ts-rest/express";
import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";

export const getAllUsers: AppRouteQueryImplementation<
  typeof userContract.getAllUsers
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const { data: users, total } = await userRepository.getAll({
      skip,
      limit,
      role,
      search,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      body: {
        data: users.map((user) => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          status: user.status,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get users",
      },
    };
  }
};


export const getUserByID: AppRouteQueryImplementation<
  typeof userContract.getUserByID
> = async ({ req }) => {
  const { userID } = req.params;

  try {
    const user = await userRepository.getByID(userID);

    if (!user) {
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
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        status: user.status,
      },
    };
  } catch (error) {
    console.error("Error in getUserByID:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get user",
      },
    };
  }
};

export const userQueryHandler = {
  getAllUsers,
  getUserByID,
};
