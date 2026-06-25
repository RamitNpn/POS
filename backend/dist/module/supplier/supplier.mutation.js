"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierMutationHandler = exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = void 0;
const supplier_repository_1 = __importDefault(require("../../repository/supplier.repository"));
const createSupplier = async ({ req }) => {
    try {
        console.log("[createSupplier] request body:", req.body);
        const existing = await supplier_repository_1.default.getAll({
            skip: 0,
            limit: 1,
            search: req.body.email,
        });
        console.log("[createSupplier] existing search result:", {
            total: existing?.total,
            dataLength: existing?.data?.length,
        });
        const emailExists = existing.data.find((s) => s.email === req.body.email);
        console.log("[createSupplier] email check:", {
            email: req.body.email,
            exists: !!emailExists,
        });
        if (emailExists) {
            console.log("[createSupplier] blocked - duplicate email");
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Supplier already exists",
                },
            };
        }
        const created = await supplier_repository_1.default.create(req.body);
        console.log("[createSupplier] created supplier:", created);
        return {
            status: 201,
            body: {
                success: true,
                message: "Supplier created successfully",
            },
        };
    }
    catch (error) {
        console.error("[createSupplier] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createSupplier = createSupplier;
const updateSupplier = async ({ req }) => {
    try {
        const { supplierId } = req.params;
        console.log("[updateSupplier] supplierId:", supplierId);
        console.log("[updateSupplier] update payload:", req.body);
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        console.log("[updateSupplier] existing supplier:", supplier);
        if (!supplier) {
            console.log("[updateSupplier] supplier not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        await supplier_repository_1.default.update(supplierId, req.body);
        console.log("[updateSupplier] update successful");
        return {
            status: 200,
            body: {
                success: true,
                message: "Supplier updated successfully",
            },
        };
    }
    catch (error) {
        console.error("[updateSupplier] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async ({ req }) => {
    try {
        const { supplierId } = req.params;
        console.log("[deleteSupplier] supplierId:", supplierId);
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        console.log("[deleteSupplier] found supplier:", supplier);
        if (!supplier) {
            console.log("[deleteSupplier] supplier not found - aborting");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        await supplier_repository_1.default.delete(supplierId);
        console.log("[deleteSupplier] deletion successful");
        return {
            status: 200,
            body: {
                success: true,
                message: "Supplier deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[deleteSupplier] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteSupplier = deleteSupplier;
exports.supplierMutationHandler = {
    createSupplier: exports.createSupplier,
    updateSupplier: exports.updateSupplier,
    deleteSupplier: exports.deleteSupplier,
};
