"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const branch_model_1 = __importDefault(require("../model/branch.model"));
class BranchRepository {
    constructor() {
        this.model = branch_model_1.default;
    }
    async create(data) {
        return this.model.create(data);
    }
    async getByID(id) {
        return this.model.findById(id);
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
    async getAll({ skip, limit, search, status, }) {
        const filter = {};
        if (status && status !== "all") {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    address: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    managerName: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        const data = await this.model
            .find(filter)
            .sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit);
        const total = await this.model.countDocuments(filter);
        return {
            data,
            total,
        };
    }
}
exports.default = new BranchRepository();
