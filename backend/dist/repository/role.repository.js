"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const role_model_1 = __importDefault(require("../model/role.model"));
class RoleRepository {
    constructor() {
        this.model = role_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating role: ${error}`);
        }
    }
    async getAll({ skip = 0, limit = 10, search, }) {
        const query = {};
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
    async getByID(roleID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roleID)) {
            return null;
        }
        return await this.model.findById(roleID);
    }
    async getByName(name) {
        return await this.model.findOne({
            name: {
                $regex: `^${name}$`,
                $options: "i",
            },
        });
    }
    async update(roleID, payload) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roleID)) {
            return null;
        }
        return await this.model.findByIdAndUpdate(roleID, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(roleID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roleID)) {
            return null;
        }
        return await this.model.findByIdAndDelete(roleID);
    }
    async countByRole(roleID) {
        return this.model.countDocuments({ roleID });
    }
}
exports.default = new RoleRepository();
