import { AppRouteMutationImplementation } from "@ts-rest/express";
import { orderContract } from "../../contract/order/order.contract";

import orderRepository from "../../repository/order.repository";
import kitchenTicketRepository from "../../repository/ticket.repository";
import TableModel from "../../model/table.model";
import MenuItem from "../../model/menu-item.model";
import mongoose from "mongoose";

const createOrder: AppRouteMutationImplementation<
  typeof orderContract.createOrder
> = async ({ req }) => {
  try {
    console.log("[CREATE ORDER] REQUEST BODY:", req.body);

    const { tableId, customerName, waiterId, notes, items } = req.body;

    console.log("[CREATE ORDER] TABLE:", tableId);
    console.log("[CREATE ORDER] ITEMS COUNT:", items?.length);

    let order = await orderRepository.getActiveOrderByTable(tableId);

    console.log("[CREATE ORDER] EXISTING ACTIVE ORDER:", order?._id || null);

    let isReorder = false;

    const resolvedItems = [];

    for (const item of items) {
      console.log("[CREATE ORDER] RESOLVING ITEM:", item.menuItemId);

      const menuItem = await MenuItem.findById(item.menuItemId);

      if (!menuItem) {
        console.log("[CREATE ORDER] MENU ITEM NOT FOUND:", item.menuItemId);

        return {
          status: 400,
          body: {
            success: false,
            error: `Menu item not found: ${item.menuItemId}`,
          },
        };
      }

      resolvedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        total: menuItem.price * item.quantity,
      });

      console.log("[CREATE ORDER] ITEM RESOLVED:", {
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.total, 0);

    const tax = Number((subtotal * 0.13).toFixed(2));

    const total = subtotal + tax;

    console.log("[CREATE ORDER] PRICING:", {
      subtotal,
      tax,
      total,
    });

    if (!order) {
      console.log("[CREATE ORDER] CREATING NEW ORDER");

      const orderNumber = await orderRepository.generateOrderNumber();

      console.log("[CREATE ORDER] GENERATED ORDER NUMBER:", orderNumber);

      order = await orderRepository.create({
        orderNumber,
        tableId: new mongoose.Types.ObjectId(tableId),
        customerName: customerName || "Guest",
        waiterId: new mongoose.Types.ObjectId(waiterId),
        notes,
        items: resolvedItems,
        subtotal,
        tax,
        total,
        ticketCount: 1,
        status: "active",
        paymentStatus: "pending",
      });

      console.log("[CREATE ORDER] ORDER CREATED:", order._id);

      await kitchenTicketRepository.create({
        orderId: order._id,
        tableId: new mongoose.Types.ObjectId(tableId),
        ticketNumber: 1,
        items: resolvedItems.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        printed: false,
        status: "pending",
      });

      console.log("[CREATE ORDER] KITCHEN TICKET CREATED");

      await TableModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(tableId),
        {
          status: "occupied",
        },
      );

      console.log("[CREATE ORDER] TABLE MARKED OCCUPIED");

      return {
        status: 201,
        body: {
          success: true,
          message: "Order created successfully",
          data: order,
        },
      };
    }

    isReorder = true;

    console.log("[CREATE ORDER] REORDER FLOW TRIGGERED");

    for (const newItem of resolvedItems) {
      const existingItem = order.items.find(
        (i: any) =>
          i.menuItemId.toString() === newItem.menuItemId.toString(),
      );

      if (existingItem) {
        console.log("[CREATE ORDER] UPDATING EXISTING ITEM:", newItem.name);

        existingItem.quantity += newItem.quantity;
        existingItem.total =
          existingItem.quantity * existingItem.price;
      } else {
        console.log("[CREATE ORDER] ADDING NEW ITEM:", newItem.name);

        order.items.push(newItem);
      }
    }

    order.subtotal += subtotal;
    order.tax += tax;
    order.total += total;

    order.ticketCount += 1;

    console.log("[CREATE ORDER] UPDATED ORDER TOTALS:", {
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      ticketCount: order.ticketCount,
    });

    await order.save();

    console.log("[CREATE ORDER] ORDER SAVED");

    await kitchenTicketRepository.create({
      orderId: order._id,
      tableId: new mongoose.Types.ObjectId(tableId),
      ticketNumber: order.ticketCount,
      items: resolvedItems.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      printed: false,
      status: "pending",
    });

    console.log("[CREATE ORDER] KITCHEN TICKET CREATED (REORDER)");

    return {
      status: 200,
      body: {
        success: true,
        message: "Order updated (reorder)",
        data: order,
      },
    };
  } catch (error) {
    console.error("[CREATE ORDER] ERROR:", error);
    console.error("[CREATE ORDER] REQUEST BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updatePaymentStatus: AppRouteMutationImplementation<
  typeof orderContract.updatePaymentStatus
> = async ({ req }) => {
  try {
    console.log("[UPDATE PAYMENT] PARAMS:", req.params);
    console.log("[UPDATE PAYMENT] BODY:", req.body);

    const { orderID } = req.params;
    const { status, paymentStatus } = req.body;

    const Payment = await orderRepository.getByID(orderID);

    console.log("[UPDATE PAYMENT] EXISTING ORDER:", Payment);

    if (!Payment) {
      console.log("[UPDATE PAYMENT] NOT FOUND:", orderID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Payment not found",
        },
      };
    }

    const updated = await orderRepository.updateStatus(
      orderID,
      status,
      paymentStatus,
    );

    console.log("[UPDATE PAYMENT] UPDATED:", updated);

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("[UPDATE PAYMENT] ERROR:", error);
    console.error("[UPDATE PAYMENT] PARAMS:", req.params);

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
    console.log("[DELETE ORDER] PARAMS:", req.params);

    const { orderID } = req.params;

    const order = await orderRepository.getByID(orderID);

    console.log("[DELETE ORDER] EXISTING ORDER:", order);

    if (!order) {
      console.log("[DELETE ORDER] NOT FOUND:", orderID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Order not found",
        },
      };
    }

    const deletedOrder = await orderRepository.delete(orderID);

    console.log("[DELETE ORDER] DELETED ORDER:", deletedOrder);

    if (deletedOrder) {
      await kitchenTicketRepository.deleteByOrderId(orderID);
      console.log("[DELETE ORDER] KITCHEN TICKETS DELETED");
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Order cancelled",
      },
    };
  } catch (error) {
    console.error("[DELETE ORDER] ERROR:", error);
    console.error("[DELETE ORDER] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to delete order",
      },
    };
  }
};

export const orderMutationHandler = {
  createOrder,
  updatePaymentStatus,
  removeOrder,
};