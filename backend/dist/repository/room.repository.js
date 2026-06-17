"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const room_model_1 = __importDefault(require("../model/room.model"));
const room_model_2 = __importDefault(require("../model/room.model"));
class RoomRepository {
    constructor() {
        this.model = room_model_2.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating user: ${error}`);
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
    async getByID(roomID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomID)) {
            return null;
        }
        return await room_model_1.default.findById(roomID);
    }
    async getByName(name) {
        return await room_model_1.default.findOne({
            name: {
                $regex: `^${name}$`,
                $options: "i",
            },
        });
    }
    async update(roomID, payload) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomID)) {
            return null;
        }
        return await room_model_1.default.findByIdAndUpdate(roomID, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(roomID) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roomID)) {
            return null;
        }
        return await room_model_1.default.findByIdAndDelete(roomID);
    }
    async countByRoom(roomID) {
        return this.model.countDocuments({ roomID });
    }
}
exports.default = new RoomRepository();
