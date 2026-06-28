import { AppRouteMutationImplementation } from "@ts-rest/express";
import { orderContract } from "../../contract/order/order.contract";

import orderRepository from "../../repository/order.repository";
import kitchenTicketRepository from "../../repository/ticket.repository";
import TableModel from "../../model/table.model";
import MenuItem from "../../model/menu-item.model";
import mongoose from "mongoose";
import logRepository from "../../repository/log.repository";
import { calculateOrderTotal } from "../../utils/totalAmountCalculator";

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

    const entityType = JSON.stringify({
      orderNumber: order?.orderNumber,
      tableId,
      customerName: customerName || "Guest",
      subtotal,
      tax,
      total,
      items: resolvedItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
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
        discount: 0, // NEW
        paymentMethod: "cash",
        ticketCount: 1,
        status: "active",
        paymentStatus: "pending",
      });

      console.log("[CREATE ORDER] ORDER CREATED:", order._id);

      await logRepository.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: "Create",
        details: `Order #${order.orderNumber} created for ${customerName || "Guest"} on table ${tableId} with ${resolvedItems.length} item(s). Total: Rs. ${total} at ${new Date().toLocaleString(
          "en-US",
          {
            timeZone: "Asia/Kathmandu",
          },
        )}`,
        module: "Order",
        entityId: `${order._id}`,
        entityType: entityType,
      });

      const kitchenTicket = await kitchenTicketRepository.create({
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

      if (kitchenTicket) {
        await logRepository.create({
          userId: new mongoose.Types.ObjectId(req.user?.id),
          action: "Create",
          details: `Kitchen Ticket #${kitchenTicket.ticketNumber} created for Order #${order.orderNumber} at ${new Date().toLocaleString(
            "en-US",
            {
              timeZone: "Asia/Kathmandu",
            },
          )}`,
          module: "Kitchen",
          entityId: `${kitchenTicket._id}`,
          entityType: entityType,
        });
      }

      await TableModel.findByIdAndUpdate(new mongoose.Types.ObjectId(tableId), {
        status: "occupied",
      });

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
        (i: any) => i.menuItemId.toString() === newItem.menuItemId.toString(),
      );

      if (existingItem) {
        console.log("[CREATE ORDER] UPDATING EXISTING ITEM:", newItem.name);

        existingItem.quantity += newItem.quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        console.log("[CREATE ORDER] ADDING NEW ITEM:", newItem.name);

        order.items.push(newItem);
      }
    }

    order.subtotal += subtotal;
    order.tax = Number((order.subtotal * 0.13).toFixed(2));
    order.total = calculateOrderTotal(
      order.subtotal,
      order.tax,
      order.discount ?? 0,
    );

    order.ticketCount += 1;

    console.log("[CREATE ORDER] UPDATED ORDER TOTALS:", {
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      ticketCount: order.ticketCount,
    });

    const reorderDone = await order.save();

    console.log("[CREATE ORDER] ORDER SAVED");

    if (reorderDone) {
      await logRepository.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: "Update",
        details: `Order #${order.orderNumber} updated with Ticket #${order.ticketCount}. ${resolvedItems.length} additional item(s) added. New total: Rs. ${order.total} at ${new Date().toLocaleString(
          "en-US",
          {
            timeZone: "Asia/Kathmandu",
          },
        )}`,
        module: "Order",
        entityId: `${order._id}`,
        entityType: entityType,
      });
    }

    const reorderKitchenTicket = await kitchenTicketRepository.create({
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

    if (reorderKitchenTicket) {
      await logRepository.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: "Create",
        details: `Kitchen Ticket #${reorderKitchenTicket.ticketNumber} created for Order #${order.orderNumber} (Reorder) at ${new Date().toLocaleString(
          "en-US",
          {
            timeZone: "Asia/Kathmandu",
          },
        )}`,
        module: "Kitchen",
        entityId: `${reorderKitchenTicket._id}`,
        entityType: entityType,
      });
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

    const { status, paymentStatus, paymentMethod, discount } = req.body;

    const order = await orderRepository.getByID(orderID);

    console.log("[UPDATE PAYMENT] EXISTING ORDER:", order);

    if (!order) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Order not found",
        },
      };
    }

    const total = calculateOrderTotal(order.subtotal, order.tax, discount);

    const updated = await orderRepository.updateStatus(orderID, {
      status,
      paymentStatus,
      paymentMethod,
      discount,
      total,
    });

    console.log("[UPDATE PAYMENT] UPDATED:", updated);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `Order ${order.orderNumber} payment status updated as ${status} at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Order",
      entityId: `${orderID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment updated successfully",
        data: updated,
      },
    };
  } catch (error) {
    console.error("[UPDATE PAYMENT] ERROR:", error);

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

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `Order ${order.orderNumber} deleted at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Order",
      entityId: `${orderID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
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
