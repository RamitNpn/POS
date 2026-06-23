"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_model_1 = __importDefault(require("../model/log.model"));
class ActivityLogRepository {
    constructor() {
        this.model = log_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating activity log: ${error}`);
        }
    }
    async getAll({ skip, limit, search, module, userId, }) {
        try {
            const query = {};
            if (module)
                query.module = module;
            if (userId)
                query.userId = userId;
            if (search) {
                query.$or = [
                    { action: { $regex: search, $options: "i" } },
                    { details: { $regex: search, $options: "i" } },
                    { module: { $regex: search, $options: "i" } },
                ];
            }
            const data = await this.model
                .find(query)
                .populate("userId", "name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return { data, total };
        }
        catch (error) {
            throw new Error(`Error fetching activity logs: ${error}`);
        }
    }
    async getByID(id) {
        try {
            return await this.model
                .findById(id)
                .populate("userId", "name email role");
        }
        catch (error) {
            throw new Error(`Error fetching activity log: ${error}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error(`Error deleting activity log: ${error}`);
        }
    }
}
exports.default = new ActivityLogRepository();
