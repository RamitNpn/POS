import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuCategoryContract } from "../../contract/menu-category/menu-category.contract";
import menuCategoryRepository from "../../repository/menu-category.repository";
import menuItemRepository from "../../repository/menu-item-repository";

export const getAllMenuCategories: AppRouteQueryImplementation<
  typeof menuCategoryContract.getAllMenuCategories
> = async ({ req }) => {
  try {
    console.log("[GET ALL MENU CATEGORIES] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    console.log("[GET ALL MENU CATEGORIES] PARSED:", { page, limit });

    const skip = (page - 1) * limit;

    console.log("[GET ALL MENU CATEGORIES] SKIP VALUE:", skip);

    console.log("[GET ALL MENU CATEGORIES] SEARCH:", req.query.search);

    console.log("[GET ALL MENU CATEGORIES] FETCHING CATEGORIES...");

    const { data, total } = await menuCategoryRepository.getAll({
      skip,
      limit,
      search: req.query.search as string,
    });

    console.log("[GET ALL MENU CATEGORIES] DB RESULT:", {
      returned: data?.length,
      total,
    });

    console.log("[GET ALL MENU CATEGORIES] ENRICHING ITEM COUNTS...");

    const formattedData = await Promise.all(
      data.map(async (category) => {
        console.log("[CATEGORY PROCESSING]", category._id.toString());

        const itemCount = await menuItemRepository.countByCategory(
          category._id.toString(),
        );

        console.log("[CATEGORY ITEM COUNT]", {
          categoryId: category._id.toString(),
          itemCount,
        });

        return {
          _id: category._id.toString(),
          name: category.name,
          description: category.description,
          itemCount,
        };
      }),
    );

    console.log("[GET ALL MENU CATEGORIES] FORMATTED COUNT:", formattedData.length);

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
  } catch (error) {
    console.error("[GET ALL MENU CATEGORIES] ERROR:", error);
    console.error("[GET ALL MENU CATEGORIES] QUERY:", req.query);

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
  try {
    console.log("[GET MENU CATEGORY BY ID] PARAMS:", req.params);

    const category = await menuCategoryRepository.getByID(req.params.categoryID);

    console.log("[GET MENU CATEGORY BY ID] DB RESULT:", category);

    if (!category) {
      console.log("[GET MENU CATEGORY BY ID] NOT FOUND:", req.params.categoryID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Category not found",
        },
      };
    }

    console.log("[GET MENU CATEGORY BY ID] FETCHING ITEM COUNT...");

    const itemCount = await menuItemRepository.countByCategory(
      category._id.toString(),
    );

    console.log("[GET MENU CATEGORY BY ID] ITEM COUNT:", itemCount);

    return {
      status: 200,
      body: {
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        itemCount,
        createdAt: category.createdAt,
      },
    };
  } catch (error) {
    console.error("[GET MENU CATEGORY BY ID] ERROR:", error);
    console.error("[GET MENU CATEGORY BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const menuCategoryQueryHandler = {
  getAllMenuCategories,
  getMenuCategoryByID,
};