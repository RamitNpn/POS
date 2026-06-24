import { AppRouteQueryImplementation } from "@ts-rest/express";
import purchaseRepository from "../../repository/purchase.repository";
import purchaseItemRepository from "../../repository/purchase-item.repository";
import { purchaseContract } from "../../contract/purchase/purchase.contract";

export const getAllPurchases: AppRouteQueryImplementation<
  typeof purchaseContract.getAllPurchases
> = async ({ req }) => {
  try {
    console.log("[GET ALL PURCHASES] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    console.log("[GET ALL PURCHASES] PAGINATION:", { page, limit, skip });

    console.log("[GET ALL PURCHASES] FETCHING FROM DB...");

    const { data, total } = await purchaseRepository.getAll({
      skip,
      limit,
    });

    console.log("[GET ALL PURCHASES] DB RESULT:", {
      returned: data?.length,
      total,
    });

    const formatted = data.map((p: any) => ({
      _id: p._id.toString(),
      invoiceNumber: p.invoiceNumber,
      supplier: {
        _id: p.supplierId?._id?.toString() ?? "",
        name: p.supplierId?.name ?? "",
      },
      totalAmount: p.totalAmount,
      purchaseDate: p.purchaseDate,
      createdAt: p.createdAt,
    }));

    console.log("[GET ALL PURCHASES] FORMATTED COUNT:", formatted.length);

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
    console.error("[GET ALL PURCHASES] ERROR:", error);
    console.error("[GET ALL PURCHASES] QUERY:", req.query);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch purchases",
      },
    };
  }
};

export const getPurchaseByID: AppRouteQueryImplementation<
  typeof purchaseContract.getPurchaseByID
> = async ({ req }) => {
  try {
    console.log("[GET PURCHASE BY ID] PARAMS:", req.params);

    const purchase = await purchaseRepository.getByID(req.params.purchaseId);

    console.log("[GET PURCHASE BY ID] PURCHASE:", purchase);

    if (!purchase) {
      console.log("[GET PURCHASE BY ID] NOT FOUND:", req.params.purchaseId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Purchase not found",
        },
      };
    }

    console.log("[GET PURCHASE BY ID] FETCHING ITEMS...");

    const items = await purchaseItemRepository.getByPurchaseId(
      purchase._id.toString(),
    );

    console.log("[GET PURCHASE BY ID] ITEMS COUNT:", items.length);

    return {
      status: 200,
      body: {
        _id: purchase._id.toString(),
        invoiceNumber: purchase.invoiceNumber,
        supplierId: purchase.supplierId.toString(),
        purchaseDate: purchase.purchaseDate,
        totalAmount: purchase.totalAmount,
        notes: purchase.notes,

        items: items.map((i: any) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
      },
    };
  } catch (error) {
    console.error("[GET PURCHASE BY ID] ERROR:", error);
    console.error("[GET PURCHASE BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const purchaseQueryHandler = {
  getAllPurchases,
  getPurchaseByID,
};