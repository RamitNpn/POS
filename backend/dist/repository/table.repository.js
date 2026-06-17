"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const table_model_1 = __importDefault(require("../model/table.model"));
class TableRepository {
    constructor() {
        this.model = table_model_1.default;
    }
    async create(payload) {
        return table_model_1.default.create(payload);
    }
    async getByID(tableID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(tableID)) {
            return null;
        }
        return table_model_1.default.findById(tableID).populate("sectionId");
    }
    async getByName(name) {
        return table_model_1.default.findOne({ name });
    }
    async update(tableID, payload) {
        return table_model_1.default.findByIdAndUpdate(tableID, payload, {
            new: true,
            runValidators: true,
        });
    }
    async updateStatus(tableID, status) {
        try {
            return await this.model.findByIdAndUpdate(tableID, {
                status,
            }, {
                new: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating ticket status: ${error}`);
        }
    }
    async delete(tableID) {
        return table_model_1.default.findByIdAndDelete(tableID);
    }
    async getAll({ skip, limit, search, status, sectionId, }) {
        const filter = {};
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
            filter.sectionId = new mongoose_1.default.Types.ObjectId(sectionId);
        }
        const data = await this.model
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sectionId");
        const total = await this.model.countDocuments(filter);
        return { data, total };
    }
    async countByRoom(sectionId) {
        return this.model.countDocuments({ sectionId });
    }
}
exports.default = new TableRepository();
