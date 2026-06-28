"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ledger_model_1 = __importDefault(require("../model/ledger.model"));
class CreditLedgerRepository {
    constructor() {
        this.model = ledger_model_1.default;
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
    async getAll({ skip, limit, search, type, customerPhone, }) {
        const filter = {};
        if (type && type !== "all") {
            filter.type = type;
        }
        if (customerPhone) {
            filter.customerPhone = customerPhone;
        }
        if (search) {
            filter.$or = [
                {
                    voucherNo: {
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
                    customerPhone: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    customerEmail: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    reference: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        const data = await this.model
            .find(filter)
            .sort({
            date: -1,
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
exports.default = new CreditLedgerRepository();
