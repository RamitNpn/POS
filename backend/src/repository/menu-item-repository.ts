import mongoose, { ObjectId } from "mongoose";
import MenuItem, { IMenuItem } from "../model/menu-item.model";

class MenuItemRepository {
  async create(payload: Partial<IMenuItem>) {
    return MenuItem.create(payload);
  }

  async getByID(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return MenuItem.findById(id);
  }

  async getByName(name: string) {
    return MenuItem.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
  }

  async update(id: string, payload: Partial<IMenuItem>) {
    return MenuItem.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return MenuItem.findByIdAndDelete(id);
  }

  async getAll({ skip, limit, search }: any) {
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [data, total] = await Promise.all([
      MenuItem.find(filter).skip(skip).limit(limit).sort({}),

      MenuItem.countDocuments(filter),
    ]);

    return { data, total };
  }

  async countByCategory(categoryId: string) {
    const objectId = new mongoose.Types.ObjectId(categoryId);
    return MenuItem.countDocuments({ categoryId: objectId });
  }
}

export default new MenuItemRepository();
