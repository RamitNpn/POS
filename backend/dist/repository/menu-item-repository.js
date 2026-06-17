"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menu_item_model_1 = __importDefault(require("../model/menu-item.model"));
class MenuItemRepository {
    async create(payload) {
        return menu_item_model_1.default.create(payload);
    }
    async getByID(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return null;
        return menu_item_model_1.default.findById(id);
    }
    async getByName(name) {
        return menu_item_model_1.default.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
        });
    }
    async update(id, payload) {
        return menu_item_model_1.default.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return menu_item_model_1.default.findByIdAndDelete(id);
    }
    async getAll({ skip, limit, search }) {
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        const [data, total] = await Promise.all([
            menu_item_model_1.default.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            menu_item_model_1.default.countDocuments(filter),
        ]);
        return { data, total };
    }
    async countByCategory(categoryId) {
        return menu_item_model_1.default.countDocuments({ categoryId });
    }
}
exports.default = new MenuItemRepository();
