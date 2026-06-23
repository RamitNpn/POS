import mongoose from "mongoose";
import RoleModel, { IRole } from "../model/role.model";

class RoleRepository {
  private model;

  constructor() {
    this.model = RoleModel;
  }

  async create(data: Partial<IRole>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating role: ${error}`);
    }
  }

  async getAll({
    skip = 0,
    limit = 10,
    search,
  }: {
    skip?: number;
    limit?: number;
    search?: string;
  }) {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { isActive: { $regex: search, $options: "i" } },
      ];
    }

    const data = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(query);

    return {
      data,
      total,
    };
  }

  async getByID(roleID: string) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      return null;
    }

    return await this.model.findById(roleID);
  }

  async getByName(name: string) {
    return await this.model.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });
  }

  async update(roleID: string, payload: Partial<IRole>) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      return null;
    }

    return await this.model.findByIdAndUpdate(roleID, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(roleID: string) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      return null;
    }

    return await this.model.findByIdAndDelete(roleID);
  }

  async countByRole(roleID: string) {
    return this.model.countDocuments({ roleID });
  }
}

export default new RoleRepository();
