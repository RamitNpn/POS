import mongoose from "mongoose";
import { AppRouteMutationImplementation } from "@ts-rest/express";

import { inventoryContract } from "../../contract/inventory/inventory.contract";
import inventoryRepository from "../../repository/inventory.repository";

export const createInventory: AppRouteMutationImplementation<
  typeof inventoryContract.createInventory
> = async ({ req }) => {
  try {
    const existing = await inventoryRepository.getBySKU(req.body.sku);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "SKU already exists",
        },
      };
    }

    await inventoryRepository.create({
      ...req.body,
      supplierId: req.body.supplierId
        ? new mongoose.Types.ObjectId(req.body.supplierId)
        : undefined,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Inventory item created successfully",
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

export const updateInventory: AppRouteMutationImplementation<
  typeof inventoryContract.updateInventory
> = async ({ req }) => {
  try {
    const { inventoryID } = req.params;

    const item = await inventoryRepository.getByID(inventoryID);

    if (!item) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Inventory item not found",
        },
      };
    }

    await inventoryRepository.update(inventoryID, {
      ...req.body,
      supplierId: req.body.supplierId
        ? new mongoose.Types.ObjectId(req.body.supplierId)
        : undefined,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Inventory updated successfully",
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

export const removeInventory: AppRouteMutationImplementation<
  typeof inventoryContract.removeInventory
> = async ({ req }) => {
  try {
    const { inventoryID } = req.params;

    const item = await inventoryRepository.getByID(inventoryID);

    if (!item) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Inventory item not found",
        },
      };
    }

    await inventoryRepository.delete(inventoryID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Inventory item deleted successfully",
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

export const inventoryMutationHandler = {
  createInventory,
  updateInventory,
  removeInventory,
};
