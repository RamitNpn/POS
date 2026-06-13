import mongoose from "mongoose";

import Inventory, {
  IInventory,
} from "../model/inventory.model";

class InventoryRepository {
  async create(payload: Partial<IInventory>) {
    return Inventory.create(payload);
  }

  async getByID(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Inventory.findById(id);
  }

  async getBySKU(sku: string) {
    return Inventory.findOne({
      sku,
    });
  }

  async update(
    id: string,
    payload: Partial<IInventory>,
  ) {
    return Inventory.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async delete(id: string) {
    return Inventory.findByIdAndDelete(id);
  }

  async getAll({
    skip,
    limit,
    search,
    category,
  }: {
    skip: number;
    limit: number;
    search?: string;
    category?: string;
  }) {
    const filter: any = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    const [data, total] = await Promise.all([
      Inventory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Inventory.countDocuments(filter),
    ]);

    return {
      data,
      total,
    };
  }
}

export default new InventoryRepository();