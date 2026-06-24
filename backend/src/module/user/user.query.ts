import { AppRouteQueryImplementation } from "@ts-rest/express";
import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";

export const getAllUsers: AppRouteQueryImplementation<
  typeof userContract.getAllUsers
> = async ({ req }) => {
  try {
    console.log("[getAllUsers] query params:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    console.log("[getAllUsers] filters:", {
      page,
      limit,
      skip,
      role,
      search,
    });

    const { data: users, total } = await userRepository.getAll({
      skip,
      limit,
      role,
      search,
    });

    console.log("[getAllUsers] repository response:", {
      total,
      usersCount: users.length,
    });

    if (users.length > 0) {
      console.log("[getAllUsers] first user sample:", {
        id: users[0]._id,
        email: users[0].email,
        role: users[0].role,
        status: users[0].status,
      });
    }

    const totalPages = Math.ceil(total / limit);

    const formattedUsers = users.map((user, index) => {
      console.log(`[getAllUsers] mapping user ${index}:`, {
        id: user._id,
        email: user.email,
        role: user.role,
      });

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      };
    });

    console.log(
      "[getAllUsers] formatted users sample:",
      formattedUsers.slice(0, 2),
    );

    return {
      status: 200,
      body: {
        data: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("[getAllUsers] error:", error);

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
    console.log("[getUserByID] userID:", userID);

    const user = await userRepository.getByID(userID);

    console.log("[getUserByID] user found:", user);

    if (!user) {
      console.log("[getUserByID] user not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const formattedUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
    };

    console.log("[getUserByID] formatted user:", {
      id: formattedUser._id,
      email: formattedUser.email,
      role: formattedUser.role,
      status: formattedUser.status,
    });

    return {
      status: 200,
      body: formattedUser,
    };
  } catch (error) {
    console.error("[getUserByID] error:", error);

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
