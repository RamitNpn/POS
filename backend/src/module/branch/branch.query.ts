import { AppRouteQueryImplementation } from "@ts-rest/express";
import { branchContract } from "../../contract/branch/branch.contract";
import branchRepository from "../../repository/branch.repository";

export const getAllBranches: AppRouteQueryImplementation<
  typeof branchContract.getAllBranches
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const skip = (page - 1) * limit;

    const { data, total } = await branchRepository.getAll({
      skip,
      limit,
      search,
      status,
    });

    const formattedData = data.map((branch) => ({
      _id: branch._id.toString(),
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      managerName: branch.managerName,
      status: branch.status,
      opened: branch.opened,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
    }));

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
        error: "Failed to fetch branches",
      },
    };
  }
};

export const getBranchById: AppRouteQueryImplementation<
  typeof branchContract.getBranchByID
> = async ({ req }) => {
  try {
    const { branchID } = req.params;

    const branch = await branchRepository.getByID(branchID);

    if (!branch) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Branch not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: branch._id.toString(),
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        managerName: branch.managerName,
        status: branch.status,
        opened: branch.opened,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch branch",
      },
    };
  }
};

export const branchQueryHandler = {
  getAllBranches,
  getBranchById,
};
