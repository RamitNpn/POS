import mongoose from "mongoose";
import Order, { IOrder } from "../model/order.model";

class OrderRepository {
  // CREATE
  async create(payload: Partial<IOrder>) {
    return Order.create(payload);
  }

  // GET BY ID (with relations)
  async getByID(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return Order.findById(id)
      .populate("tableId")
      .populate("waiterId")
      .populate("items.menuItemId");
  }

  // GET BY ORDER NUMBER
  async getByOrderNumber(orderNumber: string) {
    return Order.findOne({ orderNumber });
  }

  // GET ALL (filters + pagination)
  async getAll({
    skip,
    limit,
    status,
    tableId,
    search,
  }: {
    skip: number;
    limit: number;
    status?: string;
    tableId?: string;
    search?: string;
  }) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (tableId && mongoose.Types.ObjectId.isValid(tableId)) {
      filter.tableId = new mongoose.Types.ObjectId(tableId);
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("tableId")
        .populate("waiterId")
        .populate("items.menuItemId"),

      Order.countDocuments(filter),
    ]);

    return { data, total };
  }

  // UPDATE
  async update(id: string, payload: Partial<IOrder>) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  // DELETE
  async delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return Order.findByIdAndDelete(id);
  }
}

export default new OrderRepository();