"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const inventory_model_1 = __importDefault(require("../model/inventory.model"));
class InventoryRepository {
    async create(payload) {
        return inventory_model_1.default.create(payload);
    }
    async getByID(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return inventory_model_1.default.findById(id);
    }
    async getBySKU(sku) {
        return inventory_model_1.default.findOne({
            sku,
        });
    }
    async update(id, payload) {
        return inventory_model_1.default.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return inventory_model_1.default.findByIdAndDelete(id);
    }
    async getAll({ skip, limit, search, category, }) {
        const filter = {};
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
            inventory_model_1.default.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            inventory_model_1.default.countDocuments(filter),
        ]);
        return {
            data,
            total,
        };
    }
}
exports.default = new InventoryRepository();
