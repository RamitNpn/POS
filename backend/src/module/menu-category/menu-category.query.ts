import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import menuCategoryRepository from "../../repository/menu-category.repository";
import menuItemRepository from "../../repository/menu-item-repository";

export const getAllMenuCategories: AppRouteQueryImplementation<
  typeof menuCategoryContract.getAllMenuCategories
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    const { data, total } = await menuCategoryRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
    });

    const formattedData = await Promise.all(
      data.map(async (category) => {
        const itemCount = await menuItemRepository.countByCategory(
          category._id.toString(),
        );

        return {
          _id: category._id.toString(),
          name: category.name,
          description: category.description,
          itemCount,
        };
      }),
    );

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
        error: "Failed to fetch menu categories",
      },
    };
  }
};

export const getMenuCategoryByID: AppRouteQueryImplementation<
  typeof menuCategoryContract.getMenuCategoryByID
> = async ({ req }) => {
  const category = await menuCategoryRepository.getByID(req.params.categoryID);

  if (!category) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Category not found",
      },
    };
  }

  const itemCount = await menuItemRepository.countByCategory(category._id.toString());

  return {
    status: 200,
    body: {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      itemCount: itemCount,
      createdAt: category.createdAt,
    },
  };
};

export const menuCategoryQueryHandler = {
  getAllMenuCategories,
  getMenuCategoryByID,
};
