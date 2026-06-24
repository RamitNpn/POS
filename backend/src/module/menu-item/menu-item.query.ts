import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";
import menuItemRepository from "../../repository/menu-item-repository";

export const getAllMenuItems: AppRouteQueryImplementation<
  typeof menuItemContract.getAllMenuItems
> = async ({ req }) => {
  try {
    console.log("[GET ALL MENU ITEMS] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    console.log("[GET ALL MENU ITEMS] PARSED PAGINATION:", { page, limit });

    const skip = (page - 1) * limit;

    console.log("[GET ALL MENU ITEMS] SKIP VALUE:", skip);

    console.log("[GET ALL MENU ITEMS] SEARCH FILTER:", req.query.search);

    console.log("[GET ALL MENU ITEMS] FETCHING FROM DB...");

    const { data, total } = await menuItemRepository.getAll({
      skip,
      limit,
      search: req.query.search as string,
    });

    console.log("[GET ALL MENU ITEMS] DB RESULT:", {
      returned: data?.length,
      total,
    });

    const formatted = data.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId?.toString?.() ?? "",
      image: item.image,
      status: item.status,
      createdAt: item.createdAt,
    }));

    console.log("[GET ALL MENU ITEMS] FORMATTED COUNT:", formatted.length);

    return {
      status: 200,
      body: {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("[GET ALL MENU ITEMS] ERROR:", error);
    console.error("[GET ALL MENU ITEMS] QUERY:", req.query);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch menu items",
      },
    };
  }
};

export const getMenuItemByID: AppRouteQueryImplementation<
  typeof menuItemContract.getMenuItemByID
> = async ({ req }) => {
  try {
    console.log("[GET MENU ITEM BY ID] PARAMS:", req.params);

    const item = await menuItemRepository.getByID(req.params.itemID);

    console.log("[GET MENU ITEM BY ID] DB RESULT:", item);

    if (!item) {
      console.log("[GET MENU ITEM BY ID] NOT FOUND:", req.params.itemID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Item not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId?.toString?.() ?? "",
        image: item.image,
        status: item.status,
        createdAt: item.createdAt,
      },
    };
  } catch (error) {
    console.error("[GET MENU ITEM BY ID] ERROR:", error);
    console.error("[GET MENU ITEM BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const menuItemQueryHandler = {
  getAllMenuItems,
  getMenuItemByID,
};