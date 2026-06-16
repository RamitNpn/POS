import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";

import { tableContract } from "../../contract/table/table.contract";
import tableRepository from "../../repository/table.repository";

export const createTable: AppRouteMutationImplementation<
  typeof tableContract.createTable
> = async ({ req }) => {
  try {
    const existing = await tableRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Table name already exists",
        },
      };
    }

    await tableRepository.create({
      ...req.body,
      sectionId: new mongoose.Types.ObjectId(req.body.sectionId)
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Table created successfully",
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

export const updateTable: AppRouteMutationImplementation<
  typeof tableContract.updateTable
> = async ({ req }) => {
  try {
    const { tableID } = req.params;

    const table = await tableRepository.getByID(tableID);

    if (!table) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Table not found",
        },
      };
    }

    if (req.body.name && req.body.name !== table.name) {
      const exists = await tableRepository.getByName(req.body.name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Table name already exists",
          },
        };
      }
    }

    await tableRepository.update(tableID, {
      ...req.body,
      sectionId: req.body.sectionId
        ? new mongoose.Types.ObjectId(req.body.sectionId)
        : undefined,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Table updated successfully",
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

export const removeTable: AppRouteMutationImplementation<
  typeof tableContract.removeTable
> = async ({ req }) => {
  const { tableID } = req.params;

  const table = await tableRepository.getByID(tableID);

  if (!table) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Table not found",
      },
    };
  }

  await tableRepository.delete(tableID);

  return {
    status: 200,
    body: {
      success: true,
      message: "Table deleted successfully",
    },
  };
};

export const tableMutationHandler = {
  createTable,
  updateTable,
  removeTable,
};
