import { AppRouteQueryImplementation } from "@ts-rest/express";
import { roleContract } from "../../contract/role/role.contract";
import roleRepository from "../../repository/role.repository";
import tableRepository from "../../repository/table.repository";
import userRepository from "../../repository/user.repository";

export const getAllRoles: AppRouteQueryImplementation<
  typeof roleContract.getAllRoles
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const { data, total } = await roleRepository.getAll({
      skip,
      limit,
      search,
    });

    const formattedData = await Promise.all(
      data.map(async (role) => {
        const userCount = await userRepository.countByRole(role._id.toString());

        return {
          _id: role._id.toString(),
          name: role.name,
          description: role.description,
          userCount,
          isActive: role.isActive,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }),
    );

    return {
      status: 200,
      body: {
        data: formattedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch roles",
      },
    };
  }
};

export const getRoleByID: AppRouteQueryImplementation<
  typeof roleContract.getRoleByID
> = async ({ req }) => {
  try {
    const { roleID } = req.params;

    const role = await roleRepository.getByID(roleID);

    if (!role) {
      return {
        status: 404,
        body: {
          success: false,
          error: "role not found",
        },
      };
    }

    const userCount = await roleRepository.countByRole(role._id.toString());

    return {
      status: 200,
      body: {
        _id: role._id.toString(),
        name: role.name,
        userCount: userCount,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch role",
      },
    };
  }
};

export const roleQueryHandler = {
  getAllRoles,
  getRoleByID,
};
