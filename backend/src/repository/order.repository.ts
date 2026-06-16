import OrderModel, { IOrder } from "../model/order.model";

class OrderRepository {
  private model;

  constructor() {
    this.model = OrderModel;
  }

  async create(data: Partial<IOrder>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating order: ${error}`);
    }
  }

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
    try {
      const query: any = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (tableId) {
        query.tableId = tableId;
      }

      if (search) {
        query.$or = [
          {
            orderNumber: {
              $regex: search,
              $options: "i",
            },
          },
          {
            customerName: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      const data = await this.model
        .find(query)
        .populate("tableId")
        .populate("waiterId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return {
        data,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching orders: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model
        .findById(id)
        .populate("tableId")
        .populate("waiterId");
    } catch (error) {
      throw new Error(`Error fetching order: ${error}`);
    }
  }

  async getByOrderNumber(orderNumber: string) {
    try {
      return await this.model.findOne({
        orderNumber,
      });
    } catch (error) {
      throw new Error(`Error fetching order: ${error}`);
    }
  }

  async getActiveOrderByTable(tableId: string) {
    try {
      return await this.model
        .findOne({
          tableId,
          status: "active",
        })
        .populate("tableId")
        .populate("waiterId");
    } catch (error) {
      throw new Error(`Error fetching active order: ${error}`);
    }
  }

  async update(id: string, data: Partial<IOrder>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating order: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting order: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting orders: ${error}`);
    }
  }

  async generateOrderNumber() {
    try {
      const latestOrder = await this.model.findOne().sort({ createdAt: -1 });

      if (!latestOrder) {
        return "ORD-000001";
      }

      const currentNumber = latestOrder.orderNumber?.replace("ORD-", "") || "0";

      const nextNumber = Number(currentNumber) + 1;

      return `ORD-${String(nextNumber).padStart(6, "0")}`;
    } catch (error) {
      throw new Error(`Error generating order number: ${error}`);
    }
  }

  async completeOrder(id: string) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        {
          status: "completed",
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error completing order: ${error}`);
    }
  }

  async markAsPaid(id: string) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        {
          paymentStatus: "paid",
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating payment: ${error}`);
    }
  }

  async getActiveOrders() {
    try {
      return await this.model
        .find({
          status: "active",
        })
        .populate("tableId")
        .populate("waiterId")
        .sort({
          createdAt: -1,
        });
    } catch (error) {
      throw new Error(`Error fetching active orders: ${error}`);
    }
  }
}

export default new OrderRepository();
