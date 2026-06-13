import { AppRouteMutationImplementation } from "@ts-rest/express";

import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import menuCategoryRepository from "../../repository/menu-category.repository";

export const createMenuCategory: AppRouteMutationImplementation<
  typeof menuCategoryContract.createMenuCategory
> = async ({ req }) => {
  try {
    const existing = await menuCategoryRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Category already exists",
        },
      };
    }

    await menuCategoryRepository.create(req.body);

    return {
      status: 201,
      body: {
        success: true,
        message: "Menu category created successfully",
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

export const updateMenuCategory: AppRouteMutationImplementation<
  typeof menuCategoryContract.updateMenuCategory
> = async ({ req }) => {
  try {
    const { categoryID } = req.params;

    const category = await menuCategoryRepository.getByID(categoryID);

    if (!category) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Category not found",
        },
      };
    }

    if (req.body.name && req.body.name !== category.name) {
      const exists = await menuCategoryRepository.getByName(req.body.name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Category already exists",
          },
        };
      }
    }

    await menuCategoryRepository.update(categoryID, req.body);

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu category updated successfully",
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

export const removeMenuCategory: AppRouteMutationImplementation<
  typeof menuCategoryContract.removeMenuCategory
> = async ({ req }) => {
  try {
    const { categoryID } = req.params;

    const category = await menuCategoryRepository.getByID(categoryID);

    if (!category) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Category not found",
        },
      };
    }

    await menuCategoryRepository.delete(categoryID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu category deleted successfully",
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

export const menuCategoryMutationHandler = {
  createMenuCategory,
  updateMenuCategory,
  removeMenuCategory,
};
