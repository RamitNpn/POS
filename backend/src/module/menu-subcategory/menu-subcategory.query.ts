import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuSubCategoryContract } from "../../contract/menu-subcategory/menu-subcategory.contract";
import menuSubcategoryRepository from "../../repository/menu-subcategory.repository";

export const getAllMenuSubCategories: AppRouteQueryImplementation<
  typeof menuSubCategoryContract.getAllMenuSubCategories
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } =
      await menuSubcategoryRepository.getAll({
        skip: (page - 1) * limit,
        limit,
        search: req.query.search as string,
        categoryId:
          req.query.categoryId as string,
      });

    return {
      status: 200,
      body: {
        data: data.map((item) => ({
          _id: item._id.toString(),
          name: item.name,
          description: item.description,
          categoryId: item.categoryId.toString(),
          categoryName: item.categoryName,
          itemCount: item.itemCount,
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
          "Failed to fetch sub categories",
      },
    };
  }
};

export const getMenuSubCategoryByID: AppRouteQueryImplementation<
  typeof menuSubCategoryContract.getMenuSubCategoryByID
> = async ({ req }) => {
  const subCategory =
    await menuSubcategoryRepository.getByID(
      req.params.subCategoryID,
    );

  if (!subCategory) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Sub category not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      _id: subCategory._id.toString(),
      name: subCategory.name,
      description: subCategory.description,
      categoryId:
        subCategory.categoryId.toString(),
      categoryName: subCategory.categoryName,
      itemCount: subCategory.itemCount,
    },
  };
};

export const menuSubCategoryQueryHandler = {
  getAllMenuSubCategories,
  getMenuSubCategoryByID,
};