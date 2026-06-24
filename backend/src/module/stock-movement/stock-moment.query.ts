import { AppRouteQueryImplementation } from "@ts-rest/express";
import { stockMovementContract } from "../../contract/stock-movement/stock-movement.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";

export const mapStockMovement = (m: any) => {
  console.log("[mapStockMovement] raw:", {
    id: m?._id,
    ingredientId: m?.ingredientId,
    type: m?.type,
    quantity: m?.quantity,
  });

  const mapped = {
    _id: m._id.toString(),

    ingredient: {
      _id: m.ingredientId?._id?.toString() ?? "",
      name: m.ingredientId?.name ?? "",
      minimumStock: m.ingredientId?.minimumStock ?? 0,
      currentStock: m.ingredientId?.currentStock ?? 0,
      lastStockInDate: m.ingredientId?.lastStockInDate ?? "",
    },

    type: m.type,
    quantity: m.quantity,
    referenceType: m.referenceType,

    createdAt: m.createdAt?.toISOString?.() ?? "",
  };

  console.log("[mapStockMovement] mapped:", mapped);

  return mapped;
};

export const getAllStockMovements: AppRouteQueryImplementation<
  typeof stockMovementContract.getAllStockMovements
> = async ({ req }) => {
  try {
    console.log("[getAllStockMovements] request query:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    console.log("[getAllStockMovements] pagination:", { page, limit });

    const skip = (page - 1) * limit;
    console.log("[getAllStockMovements] skip:", skip);

    const { data, total } = await stockMovementRepository.getAll({
      skip,
      limit,
    });

    console.log("[getAllStockMovements] raw result:", {
      dataLength: data?.length,
      total,
    });

    const formatted = data.map((item, index) => {
      console.log(`[getAllStockMovements] mapping index ${index}`);
      return mapStockMovement(item);
    });

    console.log("[getAllStockMovements] formatted sample:", formatted.slice(0, 2));

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
    console.error("[getAllStockMovements] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch stock movements",
      },
    };
  }
};

export const getByIngredient: AppRouteQueryImplementation<
  typeof stockMovementContract.getByIngredient
> = async ({ req }) => {
  try {
    console.log("[getByIngredient] ingredientId:", req.params.ingredientId);

    const data = await stockMovementRepository.getByIngredient(
      req.params.ingredientId,
    );

    console.log("[getByIngredient] raw data length:", data?.length);

    const formatted = data.map((item, index) => {
      console.log(`[getByIngredient] mapping index ${index}`);
      return mapStockMovement(item);
    });

    console.log("[getByIngredient] formatted sample:", formatted.slice(0, 2));

    return {
      status: 200,
      body: formatted,
    };
  } catch (error) {
    console.error("[getByIngredient] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const stockMovementQueryHandler = {
  getAllStockMovements,
  getByIngredient,
};
