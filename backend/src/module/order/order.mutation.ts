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
    const { tableId, customerName, waiterId, notes, items } = req.body;

    // 1. Find active order for table
    let order = await orderRepository.getActiveOrderByTable(tableId);

    let isReorder = false;

    // 2. Convert frontend items → DB-safe items
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

    // =========================
    // CASE 1: NEW ORDER
    // =========================
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

      // Create Ticket #1
      await kitchenTicketRepository.create({
        orderId: order._id,
        tableId: new mongoose.Types.ObjectId(tableId),
        ticketNumber: 1,
        items: resolvedItems.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
        })),
        printed: false,
        status: "pending",
      });

      // Mark table occupied
      await TableModel.findByIdAndUpdate(new mongoose.Types.ObjectId(tableId), {
        status: "occupied",
      });

      return {
        status: 201,
        body: {
          success: true,
          message: "Order created successfully",
          data: order,
        },
      };
    }

    // =========================
    // CASE 2: REORDER
    // =========================
    isReorder = true;

    // Merge items into existing order
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

    // Update totals
    order.subtotal += subtotal;
    order.tax += tax;
    order.total += total;

    order.ticketCount += 1;

    await order.save();

    // Create next ticket
    await kitchenTicketRepository.create({
      orderId: order._id,
      tableId: new mongoose.Types.ObjectId(tableId),
      ticketNumber: order.ticketCount,
      items: resolvedItems.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
      })),
      printed: false,
      status: "pending",
    });

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

export const orderMutationHandler = {
  createOrder,
};
