"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reservation_model_1 = __importDefault(require("../model/reservation.model"));
class ReservationRepository {
    constructor() {
        this.model = reservation_model_1.default;
    }
    async create(payload) {
        return this.model.create(payload);
    }
    async getByID(id) {
        return this.model.findById(id).populate("tableId");
    }
    async getByTableId(tableId) {
        return this.model.find({ tableId }).populate("tableId");
    }
    async getActiveReservationForToday(tableId) {
        const today = new Date().toISOString().split("T")[0];
        return this.model.findOne({
            tableId,
            date: { $gte: today },
            status: { $ne: "confirmed" },
        });
    }
    async update(id, payload) {
        return this.model.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
    async getAll({ skip, limit, search, status, date, }) {
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (date) {
            filter.date = date;
        }
        if (search) {
            filter.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { customerPhone: { $regex: search, $options: "i" } },
            ];
        }
        const data = await this.model
            .find(filter)
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(limit)
            .populate("tableId");
        const total = await this.model.countDocuments(filter);
        return { data, total };
    }
    async getStats() {
        const stats = await this.model.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const result = {
            total: 0,
            confirmed: 0,
            pending: 0,
            cancelled: 0,
        };
        stats.forEach((s) => {
            result.total += s.count;
            if (s._id === "confirmed")
                result.confirmed = s.count;
            if (s._id === "pending")
                result.pending = s.count;
            if (s._id === "cancelled")
                result.cancelled = s.count;
        });
        return result;
    }
}
exports.default = new ReservationRepository();
