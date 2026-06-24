import { AppRouteMutationImplementation } from "@ts-rest/express";

import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import menuCategoryRepository from "../../repository/menu-category.repository";
import menuItemRepository from "../../repository/menu-item-repository";

export const createMenuCategory: AppRouteMutationImplementation<
  typeof menuCategoryContract.createMenuCategory
> = async ({ req }) => {
  try {
    console.log("[CREATE MENU CATEGORY] REQUEST BODY:", req.body);

    const existing = await menuCategoryRepository.getByName(req.body.name);

    console.log("[CREATE MENU CATEGORY] EXISTING CHECK:", existing);

    if (existing) {
      console.log("[CREATE MENU CATEGORY] DUPLICATE NAME:", req.body.name);

      return {
        status: 400,
        body: {
          success: false,
          error: "Category already exists",
        },
      };
    }

    console.log("[CREATE MENU CATEGORY] CREATING CATEGORY...");

    await menuCategoryRepository.create(req.body);

    console.log("[CREATE MENU CATEGORY] SUCCESS CREATED");

    return {
      status: 201,
      body: {
        success: true,
        message: "Menu category created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE MENU CATEGORY] ERROR:", error);
    console.error("[CREATE MENU CATEGORY] REQUEST BODY:", req.body);

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

    console.log("[UPDATE MENU CATEGORY] PARAMS:", req.params);
    console.log("[UPDATE MENU CATEGORY] BODY:", req.body);

    const category = await menuCategoryRepository.getByID(categoryID);

    console.log("[UPDATE MENU CATEGORY] EXISTING CATEGORY:", category);

    if (!category) {
      console.log("[UPDATE MENU CATEGORY] NOT FOUND:", categoryID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Category not found",
        },
      };
    }

    if (req.body.name && req.body.name !== category.name) {
      console.log("[UPDATE MENU CATEGORY] NAME CHANGE DETECTED");

      const exists = await menuCategoryRepository.getByName(req.body.name);

      console.log("[UPDATE MENU CATEGORY] NAME CONFLICT CHECK:", exists);

      if (exists) {
        console.log("[UPDATE MENU CATEGORY] DUPLICATE NAME:", req.body.name);

        return {
          status: 400,
          body: {
            success: false,
            error: "Category already exists",
          },
        };
      }
    }

    console.log("[UPDATE MENU CATEGORY] UPDATING CATEGORY...");

    await menuCategoryRepository.update(categoryID, req.body);

    console.log("[UPDATE MENU CATEGORY] SUCCESS UPDATED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu category updated successfully",
      },
    };
  } catch (error) {
    console.error("[UPDATE MENU CATEGORY] ERROR:", error);
    console.error("[UPDATE MENU CATEGORY] PARAMS:", req.params);
    console.error("[UPDATE MENU CATEGORY] BODY:", req.body);

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

    console.log("[DELETE MENU CATEGORY] PARAMS:", req.params);

    const category = await menuCategoryRepository.getByID(categoryID);

    console.log("[DELETE MENU CATEGORY] EXISTING CATEGORY:", category);

    if (!category) {
      console.log("[DELETE MENU CATEGORY] NOT FOUND:", categoryID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Category not found",
        },
      };
    }

    console.log("[DELETE MENU CATEGORY] DELETING CATEGORY...");

    await menuCategoryRepository.delete(categoryID);

    console.log("[DELETE MENU CATEGORY] SUCCESS DELETED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu category deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE MENU CATEGORY] ERROR:", error);
    console.error("[DELETE MENU CATEGORY] PARAMS:", req.params);

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
