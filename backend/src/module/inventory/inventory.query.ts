import { AppRouteQueryImplementation } from "@ts-rest/express";
import inventoryRepository from "../../repository/inventory.repository";
import { inventoryContract } from "../../contract/inventory/inventory.contract";

export const getAllInventory: AppRouteQueryImplementation<
  typeof inventoryContract.getAllInventory
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await inventoryRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      category: req.query.category as string,
    });

    return {
      status: 200,
      body: {
        data: data.map((item) => ({
          _id: item._id.toString(),
          sku: item.sku,
          name: item.name,
          unit: item.unit,
          currentStock: item.currentStock,
          minimumStock: item.minimumStock,
          reorderLevel: item.reorderLevel,
          costPerUnit: item.costPerUnit,
          supplierId: item.supplierId?.toString(),
          expiryDate: item.expiryDate,
          lastRestocked: item.lastRestocked,
          category: item.category,
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
        error: "Failed to fetch inventory",
      },
    };
  }
};

export const getInventoryByID: AppRouteQueryImplementation<
  typeof inventoryContract.getInventoryByID
> = async ({ req }) => {
  const item = await inventoryRepository.getByID(req.params.inventoryID);

  if (!item) {
    return {
      status: 404,
      body: {
        success: false,
        error: "Inventory item not found",
      },
    };
  }

  return {
    status: 200,
    body: {
      _id: item._id.toString(),
      sku: item.sku,
      name: item.name,
      unit: item.unit,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      reorderLevel: item.reorderLevel,
      costPerUnit: item.costPerUnit,
      supplierId: item.supplierId?.toString(),
      expiryDate: item.expiryDate,
      lastRestocked: item.lastRestocked,
      category: item.category,
    },
  };
};

export const inventoryQueryHandler = {
  getAllInventory,
  getInventoryByID,
};
