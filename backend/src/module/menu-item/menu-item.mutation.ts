import { AppRouteMutationImplementation } from "@ts-rest/express";
import { menuItemContract } from "../../contract/menu-item/menu-item.contract";
import menuItemRepository from "../../repository/menu-item-repository";
import mongoose from "mongoose";

export const createMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.createMenuItem
> = async ({ req }) => {
  try {
    console.log("[CREATE MENU ITEM] REQUEST BODY:", req.body);
    console.log("[CREATE MENU ITEM] FILES RAW:", req.files);

    const existing = await menuItemRepository.getByName(req.body.name);

    console.log("[CREATE MENU ITEM] EXISTING CHECK:", existing);

    if (existing) {
      console.log("[CREATE MENU ITEM] DUPLICATE ITEM:", req.body.name);

      return {
        status: 400,
        body: {
          success: false,
          error: "Item already exists",
        },
      };
    }

    const amount = Number(req.body.price);

    console.log("[CREATE MENU ITEM] PARSED PRICE:", amount);

    const files = req.files as {
      image?: Express.Multer.File[];
    };

    console.log("[CREATE MENU ITEM] IMAGE FILE ARRAY:", files?.image);

    const profileUrl = files?.image?.[0]?.path || "";

    console.log("[CREATE MENU ITEM] IMAGE PATH:", profileUrl);

    console.log("[CREATE MENU ITEM] FINAL PAYLOAD:", {
      ...req.body,
      price: amount,
      image: profileUrl,
    });

    await menuItemRepository.create({
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
      image: profileUrl,
      price: amount,
    });

    console.log("[CREATE MENU ITEM] SUCCESS CREATED");

    return {
      status: 201,
      body: {
        success: true,
        message: "Menu item created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE MENU ITEM] ERROR:", error);
    console.error("[CREATE MENU ITEM] REQUEST BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.updateMenuItem
> = async ({ req }) => {
  try {
    const { itemID } = req.params;

    console.log("[UPDATE MENU ITEM] PARAMS:", req.params);
    console.log("[UPDATE MENU ITEM] BODY:", req.body);
    console.log("[UPDATE MENU ITEM] FILES:", req.files);

    const item = await menuItemRepository.getByID(itemID);

    console.log("[UPDATE MENU ITEM] EXISTING ITEM:", item);

    if (!item) {
      console.log("[UPDATE MENU ITEM] NOT FOUND:", itemID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Item not found",
        },
      };
    }

    if (req.body.name && req.body.name !== item.name) {
      console.log("[UPDATE MENU ITEM] NAME CHANGE DETECTED");

      const exists = await menuItemRepository.getByName(req.body.name);

      console.log("[UPDATE MENU ITEM] NAME CHECK:", exists);

      if (exists) {
        console.log("[UPDATE MENU ITEM] DUPLICATE NAME:", req.body.name);

        return {
          status: 400,
          body: {
            success: false,
            error: "Item already exists",
          },
        };
      }
    }

    const amount = Number(req.body.price);

    console.log("[UPDATE MENU ITEM] PARSED PRICE:", amount);

    const files = req.files as {
      image?: Express.Multer.File[];
    };

    const profileUrl = files?.image?.[0]?.path || "";

    console.log("[UPDATE MENU ITEM] IMAGE PATH:", profileUrl);

    console.log("[UPDATE MENU ITEM] FINAL UPDATE PAYLOAD:", {
      ...req.body,
      price: amount,
      image: profileUrl,
    });

    await menuItemRepository.update(itemID, {
      ...req.body,
      categoryId: req.body.categoryId
        ? new mongoose.Types.ObjectId(req.body.categoryId)
        : undefined,
      image: profileUrl,
      price: amount,
    });

    console.log("[UPDATE MENU ITEM] SUCCESS UPDATED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu item updated successfully",
      },
    };
  } catch (error) {
    console.error("[UPDATE MENU ITEM] ERROR:", error);
    console.error("[UPDATE MENU ITEM] PARAMS:", req.params);
    console.error("[UPDATE MENU ITEM] BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeMenuItem: AppRouteMutationImplementation<
  typeof menuItemContract.removeMenuItem
> = async ({ req }) => {
  try {
    const { itemID } = req.params;

    console.log("[DELETE MENU ITEM] PARAMS:", req.params);

    const item = await menuItemRepository.getByID(itemID);

    console.log("[DELETE MENU ITEM] EXISTING ITEM:", item);

    if (!item) {
      console.log("[DELETE MENU ITEM] NOT FOUND:", itemID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Item not found",
        },
      };
    }

    console.log("[DELETE MENU ITEM] DELETING ITEM...");

    await menuItemRepository.delete(itemID);

    console.log("[DELETE MENU ITEM] SUCCESS DELETED");

    return {
      status: 200,
      body: {
        success: true,
        message: "Menu item deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE MENU ITEM] ERROR:", error);
    console.error("[DELETE MENU ITEM] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const menuItemMutationHandler = {
  createMenuItem,
  updateMenuItem,
  removeMenuItem,
};
