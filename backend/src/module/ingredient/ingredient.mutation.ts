import { AppRouteMutationImplementation } from "@ts-rest/express";
import ingredientRepository from "../../repository/ingredient.repository";
import { ingredientContract } from "../../contract/ingredient/ingredient.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.createIngredient
> = async ({ req }) => {
  try {
    console.log("[CREATE INGREDIENT] REQUEST BODY:", req.body);

    const existing = await ingredientRepository.getByName(req.body.name);

    console.log("[CREATE INGREDIENT] EXISTING CHECK:", existing);

    if (existing) {
      console.log("[CREATE INGREDIENT] DUPLICATE FOUND:", req.body.name);

      return {
        status: 400,
        body: {
          success: false,
          error: "Ingredient already exists",
        },
      };
    }

    const ingredient = await ingredientRepository.create(req.body);

    console.log("[CREATE INGREDIENT] CREATED:", ingredient);

    if (req.body.currentStock > 0) {
      console.log(
        "[CREATE INGREDIENT] INITIAL STOCK ADDED:",
        req.body.currentStock,
      );

      const stock = await stockMovementRepository.create({
        ingredientId: ingredient._id,
        type: "INITIAL_STOCK",
        quantity: req.body.currentStock,
        referenceType: "SYSTEM",
      });

      if (stock) {
        const stockLog = await logRepository.create({
          userId: new mongoose.Types.ObjectId(req.user?.id),
          action: "Create",
          details: `Stock recorded for ${ingredient?.name} at ${new Date().toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Kathmandu",
            },
          )}`,
          module: "Stock",
          entityId: `${stock._id}`,
          entityType: "Ingredient",
        });

        if (!stockLog) {
          console.log("User log not created", stockLog);
        }
      }

      const stockUpdate = await ingredientRepository.update(
        ingredient._id.toString(),
        {
          lastStockInDate: new Date(),
        },
      );

      if (stockUpdate) {
        const stockUpdatelog = await logRepository.create({
          userId: new mongoose.Types.ObjectId(req.user?.id),
          action: "Create",
          details: `Stock updated in ${ingredient?.name} at ${new Date().toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Kathmandu",
            },
          )}`,
          module: "Stock",
          entityId: `${ingredient._id}`,
          entityType: "Stock",
        });

        if (!stockUpdatelog) {
          console.log("User log not created", stockUpdatelog);
        }
      }

      console.log("[CREATE INGREDIENT] STOCK & LAST STOCK DATE UPDATED");
    }

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Create",
      details: `${ingredient?.name} created at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ingredient",
      entityId: `${ingredient._id}`,
      entityType: "Ingredient",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    console.log("[CREATE INGREDIENT] LOG CREATED");

    return {
      status: 201,
      body: {
        success: true,
        message: "Ingredient created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE INGREDIENT] ERROR:", error);
    console.error("[CREATE INGREDIENT] REQUEST BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.updateIngredient
> = async ({ req }) => {
  try {
    const { ingredientId } = req.params;

    console.log("[UPDATE INGREDIENT] PARAMS:", req.params);
    console.log("[UPDATE INGREDIENT] BODY:", req.body);

    const existing = await ingredientRepository.getByID(ingredientId);

    console.log("[UPDATE INGREDIENT] EXISTING:", existing);

    if (!existing) {
      console.log("[UPDATE INGREDIENT] NOT FOUND:", ingredientId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    const ingredient = await ingredientRepository.update(
      ingredientId,
      req.body,
    );

    console.log("[UPDATE INGREDIENT] UPDATED:", ingredient);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `${ingredient?.name} updated at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ingredient",
      entityId: `${ingredient?._id}`,
      entityType: "Ingredient",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    console.log("[UPDATE INGREDIENT] LOG CREATED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient updated successfully",
      },
    };
  } catch (error) {
    console.error("[UPDATE INGREDIENT] ERROR:", error);
    console.error("[UPDATE INGREDIENT] PARAMS:", req.params);
    console.error("[UPDATE INGREDIENT] BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.deleteIngredient
> = async ({ req }) => {
  try {
    const { ingredientId } = req.params;

    console.log("[DELETE INGREDIENT] PARAMS:", req.params);

    const existing = await ingredientRepository.getByID(ingredientId);

    console.log("[DELETE INGREDIENT] EXISTING:", existing);

    if (!existing) {
      console.log("[DELETE INGREDIENT] NOT FOUND:", ingredientId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    const ingredient = await ingredientRepository.delete(ingredientId);

    console.log("[DELETE INGREDIENT] DELETED:", ingredient);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `${ingredient?.name} deleted at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ingredient",
      entityId: `${ingredient?._id}`,
      entityType: "Ingredient",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    console.log("[DELETE INGREDIENT] LOG CREATED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE INGREDIENT] ERROR:", error);
    console.error("[DELETE INGREDIENT] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const ingredientMutationHandler = {
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
