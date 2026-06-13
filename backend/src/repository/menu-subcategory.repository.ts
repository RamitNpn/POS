import mongoose from "mongoose";

import MenuSubCategory, {
  IMenuSubCategory,
} from "../model/menu-subcategory.model";

class MenuSubCategoryRepository {
  private model;

  constructor() {
    this.model = MenuSubCategory;
  }

  async create(payload: Partial<IMenuSubCategory>) {
    return MenuSubCategory.create(payload);
  }

  async getByID(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return MenuSubCategory.findById(id);
  }

  async getByName(name: string) {
    return MenuSubCategory.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });
  }

  async update(id: string, payload: Partial<IMenuSubCategory>) {
    return MenuSubCategory.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return MenuSubCategory.findByIdAndDelete(id);
  }

  async getAll({
    skip,
    limit,
    search,
    categoryId,
  }: {
    skip: number;
    limit: number;
    search?: string;
    categoryId?: string;
  }) {
    const filter: any = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (categoryId) {
      filter.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    const data = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(filter);

    return { data, total };
  }
}

export default new MenuSubCategoryRepository();
