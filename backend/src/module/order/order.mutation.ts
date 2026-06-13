import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";

import { orderContract } from "../../contract/order/order.contract";
import orderRepository from "../../repository/order.repository";

export const createOrder: AppRouteMutationImplementation<
  typeof orderContract.createOrder
> = async ({ req }) => {
  try {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const countToday = await orderRepository.getAll({
      skip: 0,
      limit: 1,
      search: undefined,
    });

    const orderNumber = `ORD-${today}-${String(countToday.total + 1).padStart(4, "0")}`;

    const order = await orderRepository.create({
      ...req.body,

      orderNumber,

      tableId: new mongoose.Types.ObjectId(req.body.tableId),
      waiterId: new mongoose.Types.ObjectId(req.body.waiterId),

      items: req.body.items.map((item) => ({
        ...item,

        menuItemId: new mongoose.Types.ObjectId(item.menuItemId),

      })),
    });
    return {
      status: 201,
      body: {
        success: true,
        message: "Order created successfully",
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

export const updateOrder: AppRouteMutationImplementation<
  typeof orderContract.updateOrder
> = async ({ req }) => {
  try {
    const { orderID } = req.params;

    const existing = await orderRepository.getByID(orderID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Order not found",
        },
      };
    }

    const updated = await orderRepository.update(orderID, {
      ...req.body,

      tableId: req.body.tableId
        ? new mongoose.Types.ObjectId(req.body.tableId)
        : undefined,

      waiterId: req.body.waiterId
        ? new mongoose.Types.ObjectId(req.body.waiterId)
        : undefined,

      items: req.body.items
        ? req.body.items.map((item) => ({
            ...item,

            menuItemId: new mongoose.Types.ObjectId(item.menuItemId),

          }))
        : undefined,

      completedAt: req.body.completedAt,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Order updated successfully",
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

export const removeOrder: AppRouteMutationImplementation<
  typeof orderContract.removeOrder
> = async ({ req }) => {
  try {
    const { orderID } = req.params;

    const existing = await orderRepository.getByID(orderID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Order not found",
        },
      };
    }

    await orderRepository.delete(orderID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Order deleted successfully",
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

export const orderMutationHandler = {
  createOrder,
  updateOrder,
  removeOrder,
};
