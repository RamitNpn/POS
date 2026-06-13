import { AppRouteMutationImplementation } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";
import menuItemRepository from "../../repository/menu-item-repository";
import mongoose from "mongoose";

export const createMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.createMenuItem
> = async ({ req }) => {
  try {
    const existing = await menuItemRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Item already exists",
        },
      };
    }

    await menuItemRepository.create({
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
      subCategoryId: req.body.subCategoryId
        ? new mongoose.Types.ObjectId(req.body.subCategoryId)
        : undefined,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Menu item created successfully",
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

export const updateMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.updateMenuItem
> = async ({ req }) => {
  try {
    const { itemID } = req.params;

    const item = await menuItemRepository.getByID(itemID);

    if (!item) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Item not found",
        },
      };
    }

    if (req.body.name && req.body.name !== item.name) {
      const exists = await menuItemRepository.getByName(req.body.name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Item already exists",
          },
        };
      }
    }

    await menuItemRepository.update(itemID, {
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
      subCategoryId: req.body.subCategoryId
        ? new mongoose.Types.ObjectId(req.body.subCategoryId)
        : undefined,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu item updated successfully",
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

export const removeMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.removeMenuItem
> = async ({ req }) => {
  try {
    const { itemID } = req.params;

    const item = await menuItemRepository.getByID(itemID);

    if (!item) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Item not found",
        },
      };
    }

    await menuItemRepository.delete(itemID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu item deleted successfully",
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

export const menuItemMutationHandler = {
  createMenuItem,
  updateMenuItem,
  removeMenuItem,
};
