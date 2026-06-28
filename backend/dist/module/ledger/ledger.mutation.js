"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditLedgerMutationHandler = exports.deleteCreditLedger = exports.updateCreditLedger = exports.createCreditLedger = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const ledger_repository_1 = __importDefault(require("../../repository/ledger.repository"));
const ledger_model_1 = __importDefault(require("../../model/ledger.model"));
const createCreditLedger = async ({ req }) => {
    try {
        const { customerName, customerPhone, customerEmail, date, type, amount, description, reference, remarks, createdBy, } = req.body;
        console.log("[CREATE CREDIT LEDGER] REQUEST BODY:", req.body);
        let nextVoucherNo = "LV-00001";
        const latestLedgerArray = await ledger_model_1.default.find({
            sort: { createdAt: -1 },
            limit: 1,
        });
        const latestLedger = latestLedgerArray && latestLedgerArray.length > 0
            ? latestLedgerArray[0]
            : null;
        if (latestLedger && latestLedger.voucherNo) {
            const match = latestLedger.voucherNo.match(/^LV-(\d+)$/);
            if (match) {
                const currentSerialNumber = parseInt(match[1], 10);
                const nextSerialNumber = currentSerialNumber + 1;
                nextVoucherNo = `LV-${String(nextSerialNumber).padStart(5, "0")}`;
            }
        }
        const ledger = await ledger_repository_1.default.create({
            voucherNo: nextVoucherNo,
            customerName,
            customerPhone,
            customerEmail,
            date,
            type,
            amount,
            description,
            reference,
            remarks,
            createdBy,
        });
        console.log("[CREATE CREDIT LEDGER] SUCCESS RESPONSE:", ledger);
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Create",
            details: `${ledger.customerName} ledger created with Voucher ${ledger.voucherNo} at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Credit Ledger",
            entityId: `${ledger._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Credit ledger created successfully",
                data: ledger,
            },
        };
    }
    catch (error) {
        console.error("[CREATE CREDIT LEDGER] ERROR:", error);
        console.error("[CREATE CREDIT LEDGER] REQUEST BODY:", req.body);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createCreditLedger = createCreditLedger;
const updateCreditLedger = async ({ req }) => {
    try {
        console.log("[UPDATE CREDIT LEDGER] PARAMS:", req.params);
        console.log("[UPDATE CREDIT LEDGER] BODY:", req.body);
        const ledger = await ledger_repository_1.default.update(req.params.ledgerID, req.body);
        console.log("[UPDATE CREDIT LEDGER] DB RESULT:", ledger);
        if (!ledger) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Credit ledger not found",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `${ledger.customerName} ledger updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Credit Ledger",
            entityId: `${ledger._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Credit ledger updated successfully",
                data: ledger,
            },
        };
    }
    catch (error) {
        console.error("[UPDATE CREDIT LEDGER] ERROR:", error);
        console.error("[UPDATE CREDIT LEDGER] PARAMS:", req.params);
        console.error("[UPDATE CREDIT LEDGER] BODY:", req.body);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateCreditLedger = updateCreditLedger;
const deleteCreditLedger = async ({ req }) => {
    try {
        console.log("[DELETE CREDIT LEDGER] PARAMS:", req.params);
        const ledgerData = await ledger_repository_1.default.getByID(req.params.ledgerID);
        if (!ledgerData) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Credit ledger not found",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Delete",
            details: `${ledgerData.customerName} ledger deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Credit Ledger",
            entityId: `${ledgerData._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        await ledger_repository_1.default.delete(req.params.ledgerID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Credit ledger deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[DELETE CREDIT LEDGER] ERROR:", error);
        console.error("[DELETE CREDIT LEDGER] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteCreditLedger = deleteCreditLedger;
exports.creditLedgerMutationHandler = {
    createCreditLedger: exports.createCreditLedger,
    updateCreditLedger: exports.updateCreditLedger,
    deleteCreditLedger: exports.deleteCreditLedger,
};
