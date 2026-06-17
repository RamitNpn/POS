"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
class UserRepository {
    constructor() {
        this.model = user_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    async getAll({ skip, limit, role, search, }) {
        try {
            const query = {};
            if (role && role !== "all") {
                query.role = role;
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ];
            }
            const data = await this.model
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return { data, total };
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    }
    async getByID(id) {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error}`);
        }
    }
    async getByEmail(email, includePassword = false) {
        try {
            const query = this.model.findOne({ email });
            return includePassword ? query.select("+password") : query;
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error}`);
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            throw new Error(`Error updating user: ${error}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        }
        catch (error) {
            throw new Error(`Error counting users: ${error}`);
        }
    }
}
exports.default = new UserRepository();
