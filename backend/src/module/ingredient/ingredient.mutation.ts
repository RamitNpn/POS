import { AppRouteMutationImplementation } from "@ts-rest/express";
import ingredientRepository from "../../repository/ingredient.repository";
import { ingredientContract } from "../../contract/ingredient/ingredient.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";
import logRepository from "../../repository/log.repository";
import userRepository from "../../repository/user.repository";

export const createIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.createIngredient
> = async ({ req }) => {
  try {
    const existing = await ingredientRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Ingredient already exists",
        },
      };
    }

    const ingredient = await ingredientRepository.create(req.body);

    if (req.body.currentStock > 0) {
      await stockMovementRepository.create({
        ingredientId: ingredient._id,
        type: "INITIAL_STOCK",
        quantity: req.body.currentStock,
        referenceType: "SYSTEM",
      });

      await ingredientRepository.update(ingredient._id.toString(), {
        lastStockInDate: new Date(),
      });
    }

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
        userId: admin._id,
        action: "Ingredient Create",
        details: `${admin.name} added an ingredient in ${ingredient.category}`,
        module: "Ingredient",
        entityId: `${ingredient._id}`,
        entityType: "Ingredient",
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Ingredient created successfully",
      },
    };
  } catch (error) {
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

    const existing = await ingredientRepository.getByID(ingredientId);

    if (!existing) {
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

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
        userId: admin._id,
        action: "Ingredient Update",
        details: `${admin.name} updated an ingredient in ${ingredient?.category || "list"}`,
        module: "Ingredient",
        entityId: `${ingredient?._id}`,
        entityType: "Ingredient",
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient updated successfully",
      },
    };
  } catch (error) {
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

    const existing = await ingredientRepository.getByID(ingredientId);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    const ingredient = await ingredientRepository.delete(ingredientId);

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
        userId: admin._id,
        action: "Ingredient Delete",
        details: `${admin.name} deleted an ingredient from ${ingredient?.category || "list"}`,
        module: "Ingredient",
        entityId: `${ingredient?._id}`,
        entityType: "Ingredient",
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient deleted successfully",
      },
    };
  } catch (error) {
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
