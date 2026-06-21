import { AppRouteMutationImplementation } from "@ts-rest/express";
import { orderContract } from "../../contract/order/order.contract";

import orderRepository from "../../repository/order.repository";
import kitchenTicketRepository from "../../repository/ticket.repository";
import TableModel from "../../model/table.model";
import MenuItem from "../../model/menu-item.model";
import mongoose from "mongoose";
import { getIO } from "../../utils/socket";

const createOrder: AppRouteMutationImplementation<
  typeof orderContract.createOrder
> = async ({ req }) => {
  try {
    const { tableId, customerName, waiterId, notes, items } = req.body;

    let order = await orderRepository.getActiveOrderByTable(tableId);

    let isReorder = false;

    const resolvedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);

      if (!menuItem) {
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
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.total, 0);

    const tax = Number((subtotal * 0.13).toFixed(2));

    const total = subtotal + tax;

    if (!order) {
      const orderNumber = await orderRepository.generateOrderNumber();

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

      const ticket = await kitchenTicketRepository.create({
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

      await TableModel.findByIdAndUpdate(new mongoose.Types.ObjectId(tableId), {
        status: "occupied",
      });

      try {
        const io = getIO();
        io.emit("order:created", order);
        io.emit("ticket:created", ticket);
        io.emit("table:updated", { _id: tableId, status: "occupied" });
      } catch (err) {
        console.error("Socket emit error in createOrder:", err);
      }

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

    for (const newItem of resolvedItems) {
      const existingItem = order.items.find(
        (i: any) => i.menuItemId.toString() === newItem.menuItemId.toString(),
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;

        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        order.items.push(newItem);
      }
    }

    order.subtotal += subtotal;
    order.tax += tax;
    order.total += total;

    order.ticketCount += 1;

    await order.save();

    const ticket = await kitchenTicketRepository.create({
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

    try {
      const io = getIO();
      io.emit("order:updated", order);
      io.emit("ticket:created", ticket);
      io.emit("table:updated", { _id: tableId, status: "occupied" });
    } catch (err) {
      console.error("Socket emit error in reorder:", err);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Order updated (reorder)",
        data: order,
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

export const updatePaymentStatus: AppRouteMutationImplementation<
  typeof orderContract.updatePaymentStatus
> = async ({ req }) => {
  try {
    const { orderID } = req.params;
    const { status, paymentStatus } = req.body;

    const Payment = await orderRepository.getByID(orderID);

    if (!Payment) {
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

    try {
      const io = getIO();
      io.emit("order:updated", updated);
    } catch (err) {
      console.error("Socket emit error in updatePaymentStatus:", err);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment updated",
        data: updated,
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

    const order = await orderRepository.getByID(orderID);

    if (!order) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Order not found",
        },
      };
    }

    await orderRepository.delete(orderID);

    try {
      const io = getIO();
      io.emit("order:updated", { _id: orderID, status: "cancelled" });
    } catch (err) {
      console.error("Socket emit error in removeOrder:", err);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Order cancelled",
      },
    };
  } catch (error) {
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
