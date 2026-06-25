"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierQueryHandler = exports.getSupplierByID = exports.getAllSuppliers = void 0;
const supplier_repository_1 = __importDefault(require("../../repository/supplier.repository"));
const getAllSuppliers = async ({ req }) => {
    try {
        console.log("[getAllSuppliers] query params:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const isActive = req.query.isActive;
        console.log("[getAllSuppliers] filters:", {
            page,
            limit,
            search,
            isActive,
            skip: (page - 1) * limit,
        });
        const { data, total } = await supplier_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search,
            isActive,
        });
        console.log("[getAllSuppliers] repository response:", {
            total,
            dataLength: data?.length,
        });
        const formatted = data.map((s, index) => {
            console.log(`[getAllSuppliers] mapping supplier ${index}:`, {
                id: s?._id,
                name: s?.name,
                email: s?.email,
            });
            return {
                _id: s._id.toString(),
                name: s.name,
                contactPerson: s.contactPerson,
                phone: s.phone,
                email: s.email,
                address: s.address,
                isActive: s.isActive,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            };
        });
        console.log("[getAllSuppliers] formatted sample:", formatted.slice(0, 2));
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
        console.error("[getAllSuppliers] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch suppliers",
            },
        };
    }
};
exports.getAllSuppliers = getAllSuppliers;
const getSupplierByID = async ({ req }) => {
    try {
        const { supplierId } = req.params;
        console.log("[getSupplierByID] supplierId:", supplierId);
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        console.log("[getSupplierByID] supplier found:", supplier);
        if (!supplier) {
            console.log("[getSupplierByID] supplier not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        const formattedSupplier = {
            _id: supplier._id.toString(),
            name: supplier.name,
            contactPerson: supplier.contactPerson,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address || "",
            isActive: supplier.isActive,
            createdAt: supplier.createdAt,
            updatedAt: supplier.updatedAt,
        };
        console.log("[getSupplierByID] formatted supplier:", formattedSupplier);
        return {
            status: 200,
            body: formattedSupplier,
        };
    }
    catch (error) {
        console.error("[getSupplierByID] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getSupplierByID = getSupplierByID;
exports.supplierQueryHandler = {
    getAllSuppliers: exports.getAllSuppliers,
    getSupplierByID: exports.getSupplierByID,
};
