"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menu_subcategory_model_1 = __importDefault(require("../model/menu-subcategory.model"));
class MenuSubCategoryRepository {
    constructor() {
        this.model = menu_subcategory_model_1.default;
    }
    async create(payload) {
        return menu_subcategory_model_1.default.create(payload);
    }
    async getByID(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return menu_subcategory_model_1.default.findById(id);
    }
    async getByName(name) {
        return menu_subcategory_model_1.default.findOne({
            name: {
                $regex: `^${name}$`,
                $options: "i",
            },
        });
    }
    async update(id, payload) {
        return menu_subcategory_model_1.default.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return menu_subcategory_model_1.default.findByIdAndDelete(id);
    }
    async getAll({ skip, limit, search, categoryId, }) {
        const filter = {};
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }
        if (categoryId) {
            filter.categoryId = new mongoose_1.default.Types.ObjectId(categoryId);
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
exports.default = new MenuSubCategoryRepository();
