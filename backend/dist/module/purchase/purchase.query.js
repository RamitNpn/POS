"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseQueryHandler = exports.getPurchaseByID = exports.getAllPurchases = void 0;
const purchase_repository_1 = __importDefault(require("../../repository/purchase.repository"));
const purchase_item_repository_1 = __importDefault(require("../../repository/purchase-item.repository"));
const getAllPurchases = async ({ req }) => {
    try {
        console.log("[GET ALL PURCHASES] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const skip = (page - 1) * limit;
        console.log("[GET ALL PURCHASES] PAGINATION:", { page, limit, skip });
        console.log("[GET ALL PURCHASES] FETCHING FROM DB...");
        const { data, total } = await purchase_repository_1.default.getAll({
            skip,
            limit,
        });
        console.log("[GET ALL PURCHASES] DB RESULT:", {
            returned: data?.length,
            total,
        });
        const formatted = data.map((p) => ({
            _id: p._id.toString(),
            invoiceNumber: p.invoiceNumber,
            supplier: {
                _id: p.supplierId?._id?.toString() ?? "",
                name: p.supplierId?.name ?? "",
            },
            totalAmount: p.totalAmount,
            purchaseDate: p.purchaseDate,
            createdAt: p.createdAt,
        }));
        console.log("[GET ALL PURCHASES] FORMATTED COUNT:", formatted.length);
        return {
            status: 200,
            body: {
                data: formatted,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch (error) {
        console.error("[GET ALL PURCHASES] ERROR:", error);
        console.error("[GET ALL PURCHASES] QUERY:", req.query);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch purchases",
            },
        };
    }
};
exports.getAllPurchases = getAllPurchases;
const getPurchaseByID = async ({ req }) => {
    try {
        console.log("[GET PURCHASE BY ID] PARAMS:", req.params);
        const purchase = await purchase_repository_1.default.getByID(req.params.purchaseId);
        console.log("[GET PURCHASE BY ID] PURCHASE:", purchase);
        if (!purchase) {
            console.log("[GET PURCHASE BY ID] NOT FOUND:", req.params.purchaseId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Purchase not found",
                },
            };
        }
        console.log("[GET PURCHASE BY ID] FETCHING ITEMS...");
        const items = await purchase_item_repository_1.default.getByPurchaseId(purchase._id.toString());
        console.log("[GET PURCHASE BY ID] ITEMS COUNT:", items.length);
        return {
            status: 200,
            body: {
                _id: purchase._id.toString(),
                invoiceNumber: purchase.invoiceNumber,
                supplierId: purchase.supplierId.toString(),
                purchaseDate: purchase.purchaseDate,
                totalAmount: purchase.totalAmount,
                notes: purchase.notes,
                items: items.map((i) => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    totalPrice: i.totalPrice,
                })),
            },
        };
    }
    catch (error) {
        console.error("[GET PURCHASE BY ID] ERROR:", error);
        console.error("[GET PURCHASE BY ID] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getPurchaseByID = getPurchaseByID;
exports.purchaseQueryHandler = {
    getAllPurchases: exports.getAllPurchases,
    getPurchaseByID: exports.getPurchaseByID,
};
