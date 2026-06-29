"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_model_1 = __importDefault(require("../model/ticket.model"));
class KitchenTicketRepository {
    constructor() {
        this.model = ticket_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating kitchen ticket: ${error}`);
        }
    }
    async getAll({ skip, limit, status, search, }) {
        try {
            const query = {};
            if (status && status !== "all") {
                query.status = status;
            }
            if (search) {
                query.$or = [
                    {
                        orderNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        customerName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        items: {
                            $elemMatch: {
                                name: {
                                    $regex: search,
                                    $options: "i",
                                },
                            },
                        },
                    },
                ];
            }
            const data = await this.model
                .find(query)
                .populate("orderId")
                .populate("tableId")
                .populate({
                path: "orderId",
                populate: {
                    path: "waiterId",
                },
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return {
                data,
                total,
            };
        }
        catch (error) {
            throw new Error(`Error fetching kitchen tickets: ${error}`);
        }
    }
    async getByID(id) {
        try {
            return this.model
                .findById(id)
                .populate("orderId")
                .populate("tableId")
                .populate("items.menuItemId");
        }
        catch (error) {
            throw new Error(`Error fetching kitchen ticket: ${error}`);
        }
    }
    async getByOrderID(orderId) {
        try {
            return await this.model
                .find({
                orderId,
            })
                .populate("tableId")
                .sort({
                ticketNumber: 1,
            });
        }
        catch (error) {
            throw new Error(`Error fetching order tickets: ${error}`);
        }
    }
    async getByTableID(tableId) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            return await this.model
                .find({
                tableId,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            })
                .populate("tableId")
                .populate({
                path: "orderId",
                populate: {
                    path: "waiterId",
                },
            })
                .sort({ ticketNumber: 1 });
        }
        catch (error) {
            throw new Error(`Error fetching order tickets: ${error}`);
        }
    }
    async getLatestTickets({ skip, limit, search, status, }) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const query = {
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            };
            if (status !== "all") {
                query.status = status;
            }
            if (search) {
                query.$or = [
                    {
                        orderNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        customerName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        items: {
                            $elemMatch: {
                                name: {
                                    $regex: search,
                                    $options: "i",
                                },
                            },
                        },
                    },
                ];
            }
            const data = await this.model
                .find(query)
                .populate("orderId")
                .populate("tableId")
                .populate({
                path: "orderId",
                populate: {
                    path: "waiterId",
                },
            })
                .sort({
                ticketNumber: -1,
            })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return {
                data,
                total,
            };
        }
        catch (error) {
            throw new Error(`Error fetching latest kitchen tickets: ${error}`);
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, {
                new: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating ticket: ${error}`);
        }
    }
    async updateTicketItems(ticketId, items) {
        try {
            return await this.model.findByIdAndUpdate(ticketId, {
                $set: {
                    items,
                },
            }, {
                new: true,
                runValidators: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating ticket items: ${error}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error(`Error deleting ticket: ${error}`);
        }
    }
    async deleteByOrderId(orderId) {
        return await this.model.deleteMany({
            orderId,
        });
    }
    async updateStatus(ticketId, status) {
        try {
            return await this.model.findByIdAndUpdate(ticketId, {
                status,
            }, {
                new: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating ticket status: ${error}`);
        }
    }
    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        }
        catch (error) {
            throw new Error(`Error counting tickets: ${error}`);
        }
    }
}
exports.default = new KitchenTicketRepository();
