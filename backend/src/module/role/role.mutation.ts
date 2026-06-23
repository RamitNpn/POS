import { AppRouteMutationImplementation } from "@ts-rest/express";
import { roleContract } from "../../contract/role/role.contract";
import roleRepository from "../../repository/role.repository";

export const createRole: AppRouteMutationImplementation<
  typeof roleContract.createRole
> = async ({ req }) => {
  try {
    const { name, description, isActive } = req.body;

    const existingRole = await roleRepository.getByName(name);

    if (existingRole) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Role already exists",
        },
      };
    }

    await roleRepository.create({
      name,
      description,
      isActive,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Role created successfully",
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

export const updateRole: AppRouteMutationImplementation<
  typeof roleContract.updateRole
> = async ({ req }) => {
  try {
    const { roleID } = req.params;

    const Role = await roleRepository.getByID(roleID);

    if (!Role) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Role not found",
        },
      };
    }

    const { name, description, isActive } = req.body;

    if (name && name !== Role.name) {
      const exists = await roleRepository.getByName(name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Role already exists",
          },
        };
      }
    }

    await roleRepository.update(roleID, {
      name,
      description,
      isActive,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Role updated successfully",
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

export const removeRole: AppRouteMutationImplementation<
  typeof roleContract.removeRole
> = async ({ req }) => {
  try {
    const { roleID } = req.params;

    const Role = await roleRepository.getByID(roleID);

    if (!Role) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Role not found",
        },
      };
    }

    await roleRepository.delete(roleID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Role deleted successfully",
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

export const roleMutationHandler = {
  createRole,
  updateRole,
  removeRole,
};
