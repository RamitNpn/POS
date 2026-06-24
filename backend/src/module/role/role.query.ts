import { AppRouteQueryImplementation } from "@ts-rest/express";
import { roleContract } from "../../contract/role/role.contract";
import roleRepository from "../../repository/role.repository";
import userRepository from "../../repository/user.repository";

export const getAllRoles: AppRouteQueryImplementation<
  typeof roleContract.getAllRoles
> = async ({ req }) => {
  try {
    console.log("[GET ALL ROLES] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    console.log("[GET ALL ROLES] PAGINATION:", { page, limit, skip });

    console.log("[GET ALL ROLES] FETCHING FROM DB...");

    const { data, total } = await roleRepository.getAll({
      skip,
      limit,
      search,
    });

    console.log("[GET ALL ROLES] DB RESULT:", {
      count: data?.length,
      total,
    });

    console.log("[GET ALL ROLES] ENRICHING USER COUNTS...");

    const formattedData = await Promise.all(
      data.map(async (role) => {
        const userCount = await userRepository.countByRole(
          role._id.toString(),
        );

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

    console.log("[GET ALL ROLES] FINAL RESULT COUNT:", formattedData.length);

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
  } catch (error) {
    console.error("[GET ALL ROLES] ERROR:", error);
    console.error("[GET ALL ROLES] QUERY:", req.query);

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
    console.log("[GET ROLE BY ID] PARAMS:", req.params);

    const { roleID } = req.params;

    const role = await roleRepository.getByID(roleID);

    console.log("[GET ROLE BY ID] ROLE FOUND:", !!role);

    if (!role) {
      console.warn("[GET ROLE BY ID] NOT FOUND:", roleID);

      return {
        status: 404,
        body: {
          success: false,
          error: "role not found",
        },
      };
    }

    console.log("[GET ROLE BY ID] COUNTING USERS...");

    const userCount = await roleRepository.countByRole(role._id.toString());

    console.log("[GET ROLE BY ID] USER COUNT:", userCount);

    return {
      status: 200,
      body: {
        _id: role._id.toString(),
        name: role.name,
        userCount,
        description: role.description,
        isActive: role.isActive,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
  } catch (error) {
    console.error("[GET ROLE BY ID] ERROR:", error);
    console.error("[GET ROLE BY ID] PARAMS:", req.params);

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