import { AppRouteMutationImplementation } from "@ts-rest/express";

import { menuSubCategoryContract } from "../../contract/menu-subcategory/menu-subcategory.contract";
import menuSubcategoryRepository from "../../repository/menu-subcategory.repository";
import mongoose from "mongoose";

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

    await menuSubcategoryRepository.create({
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
    });

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

    await menuSubcategoryRepository.update(subCategoryID, req.body);

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
