import { AppRouteQueryImplementation } from "@ts-rest/express";

import { orderContract } from "../../contract/order/order.contract";
import orderRepository from "../../repository/order.repository";

const mapOrder = (order: any) => {
  return {
    _id: order._id.toString(),
    orderNumber: order.orderNumber,

    tableId:
      order.tableId?._id?.toString?.() ||
      order.tableId?.toString?.() ||
      order.tableId,

    table: order.tableId,

    items: (order.items ?? []).map((item: any) => ({
      _id: item._id?.toString?.(),

      menuItemId:
        item.menuItemId?._id?.toString?.() ||
        item.menuItemId?.toString?.() ||
        item.menuItemId,

      menuItem: item.menuItemId?.name ?? item.name,

      category: item.menuItemId?.categoryId?.name ?? null,

      quantity: item.quantity,
      price: item.price,
      total: item.total ?? item.price * item.quantity,
    })),

    customerName: order.customerName,

    waiterId:
      order.waiterId?._id?.toString?.() ||
      order.waiterId?.toString?.() ||
      order.waiterId,

    waiter: order.waiterId,

    paymentStatus: order.paymentStatus,
    orderType: order.orderType,

    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,

    notes: order.notes ?? "",
    status: order.status,
    ticketCount: order.ticketCount ?? 0,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

export const getAllOrders: AppRouteQueryImplementation<
  typeof orderContract.getAllOrders
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    const status = req.query.status as string | undefined;
    const tableId = req.query.tableId as string | undefined;
    const search = req.query.search as string | undefined;
    const to = req.query.to as string | undefined;
    const from = req.query.from as string | undefined;

    const { data, total } = await orderRepository.getAll({
      skip,
      limit,
      status,
      tableId,
      search,
      to,
      from,
    });

    return {
      status: 200,
      body: {
        data: data.map(mapOrder),
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

    return {
      status: 200,
      body: mapOrder(order),
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

export const getActiveOrderByTable: AppRouteQueryImplementation<
  typeof orderContract.getActiveOrderByTable
> = async ({ req }) => {
  try {
    const { tableID } = req.params;

    const order = await orderRepository.getActiveOrderByTable(tableID);

    if (!order) {
      return {
        status: 404,
        body: {
          success: false,
          error: "No active order found for this table",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        tableId: order.tableId.toString(),
        customerName: order.customerName,
        waiterId: order.waiterId.toString(),
        notes: order.notes,
        items: order.items.map((item: any) => ({
          menuItemId: item.menuItemId.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        ticketCount: order.ticketCount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
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

export const getOrdersByDate: AppRouteQueryImplementation<
  typeof orderContract.getOrdersByDate
> = async ({ req }) => {
  try {
    const { dateReport } = req.query;

    if (!dateReport) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Date is required",
        },
      };
    }

    const orders = await orderRepository.getOrdersByDate(dateReport);

    const data = orders.map(mapOrder);

    return {
      status: 200,
      body: {
        success: true,
        data,
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

export const orderQueryHandler = {
  getAllOrders,
  getOrderByID,
  getActiveOrderByTable,
  getOrdersByDate,
};
