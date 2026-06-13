import { AppRouteQueryImplementation } from "@ts-rest/express";

import { orderContract } from "../../contract/order/order.contract";
import orderRepository from "../../repository/order.repository";

export const getAllOrders: AppRouteQueryImplementation<
  typeof orderContract.getAllOrders
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const status = req.query.status as string | undefined;
    const tableId = req.query.tableId as string | undefined;
    const search = req.query.search as string | undefined;

    const { data, total } = await orderRepository.getAll({
      skip,
      limit,
      status,
      tableId,
      search,
    });

    const formatted = data.map((order) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      tableId: order.tableId?.toString(),
      table: order.tableId,
      items: order.items.map((item: any) => ({
        _id: item._id?.toString(),
        menuItemId: item.menuItemId?._id?.toString() || item.menuItemId,
        menuItem: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
        price: item.price,
      })),
      customerName: order.customerName,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      serviceCharge: order.serviceCharge,
      total: order.total,
      notes: order.notes,
      waiterId: order.waiterId?.toString(),
      waiter: order.waiterId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      completedAt: order.completedAt,
    }));

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
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch orders",
      },
    };
  }
};

export const getOrderByID: AppRouteQueryImplementation<
  typeof orderContract.getOrderByID
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

    const formatted = {
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      tableId: order.tableId?.toString(),
      table: order.tableId,
      items: order.items.map((item: any) => ({
        _id: item._id?.toString(),
        menuItemId: item.menuItemId?._id?.toString() || item.menuItemId,
        menuItem: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
        price: item.price,
      })),
      customerName: order.customerName,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      serviceCharge: order.serviceCharge,
      total: order.total,
      notes: order.notes,
      waiterId: order.waiterId?.toString(),
      waiter: order.waiterId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      completedAt: order.completedAt,
    };

    return {
      status: 200,
      body: formatted,
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch order",
      },
    };
  }
};

export const orderQueryHandler = {
  getAllOrders,
  getOrderByID,
};