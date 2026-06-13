import mongoose from "mongoose";

import MenuCategory, { IMenuCategory } from "../model/menu-category.model";

class MenuCategoryRepository {
  private model;

  constructor() {
    this.model = MenuCategory;
  }
  async create(payload: Partial<IMenuCategory>) {
    return MenuCategory.create(payload);
  }

  async getByID(categoryID: string) {
    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
      return null;
    }

    return MenuCategory.findById(categoryID);
  }

  async getByName(name: string) {
    return MenuCategory.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });
  }

  async update(categoryID: string, payload: Partial<IMenuCategory>) {
    return MenuCategory.findByIdAndUpdate(categoryID, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(categoryID: string) {
    return MenuCategory.findByIdAndDelete(categoryID);
  }

  async getAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }) {
    const filter: any = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const data = await this.model
      .find(filter)
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const total = await this.model.countDocuments(filter);

    return {
      data,
      total,
    };
  }
}

export default new MenuCategoryRepository();
