import mongoose from "mongoose";
import Table, { ITable } from "../model/table.model";

class TableRepository {
  private model;

  constructor() {
    this.model = Table;
  }

  async create(payload: Partial<ITable>) {
    return Table.create(payload);
  }

  async getByID(tableID: string) {
    if (!mongoose.Types.ObjectId.isValid(tableID)) {
      return null;
    }

    return Table.findById(tableID).populate("sectionId");
  }

  async getByName(name: string) {
    return Table.findOne({ name });
  }

  async update(tableID: string, payload: Partial<ITable>) {
    return Table.findByIdAndUpdate(tableID, payload, {
      new: true,
      runValidators: true,
    });
  }

  async updateStatus(
    tableID: string,
    status: "available" | "occupied" | "reserved" | undefined,
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        tableID,
        {
          status,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating ticket status: ${error}`);
    }
  }

  async delete(tableID: string) {
    return Table.findByIdAndDelete(tableID);
  }

  async getAll({
    skip,
    limit,
    search,
    status,
    sectionId,
  }: {
    skip: number;
    limit: number;
    search?: string;
    status?: string;
    sectionId?: string;
  }) {
    const filter: any = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (sectionId) {
      filter.sectionId = new mongoose.Types.ObjectId(sectionId);
    }

    const data = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sectionId");

    const total = await this.model.countDocuments(filter);

    return { data, total };
  }
  async countByRoom(sectionId: string) {
    return this.model.countDocuments({ sectionId });
  }
  async getTableStats() {
    try {
      const stats = await this.model.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      const result = {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
      };

      stats.forEach((item) => {
        result.total += item.count;

        if (item._id === "available") {
          result.available = item.count;
        }

        if (item._id === "occupied") {
          result.occupied = item.count;
        }

        if (item._id === "reserved") {
          result.reserved = item.count;
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Error fetching table stats: ${error}`);
    }
  }
}

export default new TableRepository();
