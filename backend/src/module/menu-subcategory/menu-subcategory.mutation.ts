import { AppRouteMutationImplementation } from "@ts-rest/express";

import { menuSubCategoryContract } from "../../contract/menu-subcategory/menu-subcategory.contract";
import menuSubcategoryRepository from "../../repository/menu-subcategory.repository";
import mongoose from "mongoose";
import { getIO } from "../../utils/socket";

export const createMenuSubCategory: AppRouteMutationImplementation<
  typeof menuSubCategoryContract.createMenuSubCategory
> = async ({ req }) => {
  try {
    const existing = await menuSubcategoryRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Sub category already exists",
        },
      };
    }

    const data = await menuSubcategoryRepository.create({
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
    });

    try {
      const io = getIO();
      io.emit("menu-subcategory:updated", data);
    } catch (err) {
      console.error("Socket emit error in createMenuSubCategory:", err);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Menu sub-category created successfully",
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

export const updateMenuSubCategory: AppRouteMutationImplementation<
  typeof menuSubCategoryContract.updateMenuSubCategory
> = async ({ req }) => {
  try {
    const { subCategoryID } = req.params;

    const subCategory = await menuSubcategoryRepository.getByID(subCategoryID);

    if (!subCategory) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Sub category not found",
        },
      };
    }

    if (req.body.name && req.body.name !== subCategory.name) {
      const exists = await menuSubcategoryRepository.getByName(req.body.name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Sub category already exists",
          },
        };
      }
    }

    const updated = await menuSubcategoryRepository.update(subCategoryID, req.body);

    try {
      const io = getIO();
      io.emit("menu-subcategory:updated", updated);
    } catch (err) {
      console.error("Socket emit error in updateMenuSubCategory:", err);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu sub-category updated successfully",
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

export const removeMenuSubCategory: AppRouteMutationImplementation<
  typeof menuSubCategoryContract.removeMenuSubCategory
> = async ({ req }) => {
  try {
    const { subCategoryID } = req.params;

    const subCategory = await menuSubcategoryRepository.getByID(subCategoryID);

    if (!subCategory) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Sub category not found",
        },
      };
    }

    await menuSubcategoryRepository.delete(subCategoryID);

    try {
      const io = getIO();
      io.emit("menu-subcategory:updated", { _id: subCategoryID, action: "delete" });
    } catch (err) {
      console.error("Socket emit error in removeMenuSubCategory:", err);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu sub-category deleted successfully",
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

export const menuSubCategoryMutationHandler = {
  createMenuSubCategory,
  updateMenuSubCategory,
  removeMenuSubCategory,
};
