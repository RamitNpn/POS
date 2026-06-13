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

    return Table.findById(tableID);
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
      filter.section = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      filter.status = status;
    }

    if (sectionId) {
      filter.sectionId = new mongoose.Types.ObjectId(sectionId);
    }

    const data = await this.model
      .find(filter)
      .sort({ number: 1 })
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(filter);

    return { data, total };
  }
}

export default new TableRepository();
