import { AppRouteQueryImplementation } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";
import menuItemRepository from "../../repository/menu-item-repository";

export const getAllMenuItems: AppRouteQueryImplementation<
  typeof menuItemContract.getAllMenuItems
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await menuItemRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
    });

    return {
      status: 200,
      body: {
        data: data.map((item) => ({
          _id: item._id.toString(),
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: item.categoryId.toString(),
          image: item.image,
          status: item.status,
          createdAt: item.createdAt,
        })),
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
        error: "Failed to fetch menu items",
      },
    };
  }
};

export const getMenuItemByID: AppRouteQueryImplementation<
  typeof menuItemContract.getMenuItemByID
> = async ({ req }) => {
  const item = await menuItemRepository.getByID(req.params.itemID);

  if (!item) {
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
      categoryId: item.categoryId.toString(),
      image: item.image,
      status: item.status,
      createdAt: item.createdAt,
    },
  };
};

export const menuItemQueryHandler = {
  getAllMenuItems,
  getMenuItemByID,
};
