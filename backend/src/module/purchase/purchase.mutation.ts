import { AppRouteMutationImplementation } from "@ts-rest/express";
import purchaseRepository from "../../repository/purchase.repository";
import purchaseItemRepository from "../../repository/purchase-item.repository";
import ingredientRepository from "../../repository/ingredient.repository";
import { purchaseContract } from "../../contract/purchase/purchase.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";
import expensesRepository from "../../repository/expenses.repository";
import supplierRepository from "../../repository/supplier.repository";

export const createPurchase: AppRouteMutationImplementation<
  typeof purchaseContract.createPurchase
> = async ({ req }) => {
  try {
    console.log("[CREATE PURCHASE] REQUEST BODY:", req.body);

    const { supplierId, invoiceNumber, purchaseDate, notes, items } = req.body;

    console.log("[CREATE PURCHASE] BASIC INFO:", {
      supplierId,
      invoiceNumber,
      purchaseDate,
      itemsCount: items?.length,
    });

    let totalAmount = 0;

    const enrichedItems = items.map((item) => {
      const totalPrice = item.quantity * item.unitPrice;
      totalAmount += totalPrice;

      return {
        ...item,
        totalPrice,
      };
    });

    console.log("[CREATE PURCHASE] ENRICHED ITEMS:", enrichedItems);
    console.log("[CREATE PURCHASE] TOTAL AMOUNT:", totalAmount);

    // 1. Create purchase
    console.log("[CREATE PURCHASE] CREATING PURCHASE...");

    const purchase = await purchaseRepository.create({
      supplierId,
      invoiceNumber,
      purchaseDate,
      notes,
      totalAmount,
    });

    console.log("[CREATE PURCHASE] PURCHASE CREATED:", purchase._id);

    // 2. Create purchase items
    console.log("[CREATE PURCHASE] CREATING PURCHASE ITEMS...");

    const purchaseItems = enrichedItems.map((item) => ({
      purchaseId: purchase._id,
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    await purchaseItemRepository.createMany(purchaseItems);

    console.log("[CREATE PURCHASE] PURCHASE ITEMS SAVED:", purchaseItems.length);

    // 3. Process stock updates + stock movements
    for (const item of enrichedItems) {
      console.log("[CREATE PURCHASE] PROCESSING INGREDIENT:", item.ingredientId);

      const ingredient = await ingredientRepository.getByID(item.ingredientId);

      if (!ingredient) {
        console.log("[CREATE PURCHASE] INGREDIENT NOT FOUND:", item.ingredientId);
        continue;
      }

      const newStock = ingredient.currentStock + item.quantity;

      console.log("[CREATE PURCHASE] STOCK UPDATE:", {
        ingredientId: item.ingredientId,
        oldStock: ingredient.currentStock,
        added: item.quantity,
        newStock,
      });

      await ingredientRepository.update(item.ingredientId, {
        currentStock: newStock,
        lastStockInDate: new Date(),
      });

      await stockMovementRepository.create({
        ingredientId: item.ingredientId,
        type: "PURCHASE",
        quantity: item.quantity,
        referenceId: purchase._id.toString(),
        referenceType: "PURCHASE",
        note: `Purchase ${invoiceNumber}`,
      });

      console.log("[CREATE PURCHASE] STOCK MOVEMENT CREATED");
    }

    const supplier = await supplierRepository.getByID(supplierId);

    console.log("[CREATE PURCHASE] SUPPLIER:", supplier?.name);

    // 4. Create EXPENSE
    console.log("[CREATE PURCHASE] CREATING EXPENSE ENTRY...");

    await expensesRepository.create({
      category: "STOCK",
      description: `Purchase Invoice ${invoiceNumber}`,
      amount: totalAmount,
      date: new Date(purchaseDate),
      vendorName: supplier?.name,
    });

    console.log("[CREATE PURCHASE] EXPENSE CREATED");

    return {
      status: 201,
      body: {
        success: true,
        message: "Purchase created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE PURCHASE] ERROR:", error);
    console.error("[CREATE PURCHASE] REQUEST BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deletePurchase: AppRouteMutationImplementation<
  typeof purchaseContract.deletePurchase
> = async ({ req }) => {
  try {
    console.log("[DELETE PURCHASE] PARAMS:", req.params);

    const { purchaseId } = req.params;

    const purchase = await purchaseRepository.getByID(purchaseId);

    console.log("[DELETE PURCHASE] FOUND:", purchase);

    if (!purchase) {
      console.log("[DELETE PURCHASE] NOT FOUND:", purchaseId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Purchase not found",
        },
      };
    }

    console.log("[DELETE PURCHASE] DELETING PURCHASE ITEMS...");
    await purchaseItemRepository.deleteByPurchaseId(purchaseId);

    console.log("[DELETE PURCHASE] DELETING PURCHASE...");
    await purchaseRepository.delete(purchaseId);

    console.log("[DELETE PURCHASE] SUCCESS DELETED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Purchase deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE PURCHASE] ERROR:", error);
    console.error("[DELETE PURCHASE] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const purchaseMutationHandler = {
  createPurchase,
  deletePurchase,
};