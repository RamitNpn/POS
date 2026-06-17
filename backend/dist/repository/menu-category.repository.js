"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menu_category_model_1 = __importDefault(require("../model/menu-category.model"));
class MenuCategoryRepository {
    constructor() {
        this.model = menu_category_model_1.default;
    }
    async create(payload) {
        return menu_category_model_1.default.create(payload);
    }
    async getByID(categoryID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryID)) {
            return null;
        }
        return menu_category_model_1.default.findById(categoryID);
    }
    async getByName(name) {
        return menu_category_model_1.default.findOne({
            name: {
                $regex: `^${name}$`,
                $options: "i",
            },
        });
    }
    async update(categoryID, payload) {
        return menu_category_model_1.default.findByIdAndUpdate(categoryID, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(categoryID) {
        return menu_category_model_1.default.findByIdAndDelete(categoryID);
    }
    async getAll({ skip, limit, search, }) {
        const filter = {};
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }
        const data = await this.model
            .find(filter)
            .sort({
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
    async count(id) {
        return this.model.countDocuments({ _id: id });
    }
}
exports.default = new MenuCategoryRepository();
