import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import menuCategoryRepository from "../../repository/menu-category.repository";

export const getAllMenuCategories: AppRouteQueryImplementation<
  typeof menuCategoryContract.getAllMenuCategories
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } =
      await menuCategoryRepository.getAll({
        skip: (page - 1) * limit,
        limit,
        search: req.query.search as string,
      });

    return {
      status: 200,
      body: {
        data: data.map((category) => ({
          _id: category._id.toString(),
          name: category.name,
          description: category.description,
          itemCount: category.itemCount,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(
            total / limit,
          ),
        },
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error:
          "Failed to fetch menu categories",
      },
    };
  }
};

export const getMenuCategoryByID: AppRouteQueryImplementation<
  typeof menuCategoryContract.getMenuCategoryByID
> = async ({ req }) => {
  const category =
    await menuCategoryRepository.getByID(
      req.params.categoryID,
    );

  if (!category) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Category not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      itemCount: category.itemCount,
    },
  };
};

export const menuCategoryQueryHandler = {
  getAllMenuCategories,
  getMenuCategoryByID,
};