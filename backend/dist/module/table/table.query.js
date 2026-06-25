"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableQueryHandler = exports.getTableByID = exports.getAllTables = void 0;
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const getAllTables = async ({ req }) => {
    try {
        console.log("[getAllTables] query params:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const search = req.query.search;
        const status = req.query.status;
        const sectionId = req.query.sectionId;
        console.log("[getAllTables] filters:", {
            page,
            limit,
            skip: (page - 1) * limit,
            search,
            status,
            sectionId,
        });
        const { data, total } = await table_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search,
            status,
            sectionId,
        });
        console.log("[getAllTables] repository response:", {
            total,
            dataLength: data?.length,
        });
        const formattedData = data.map((table, index) => {
            console.log(`[getAllTables] mapping table ${index}:`, {
                id: table?._id,
                name: table?.name,
                status: table?.status,
                section: table?.sectionId,
            });
            return {
                _id: table._id.toString(),
                name: table.name,
                capacity: table.capacity,
                status: table.status,
                section: table.sectionId?.name ?? null,
                sectionId: table.sectionId?._id?.toString(),
            };
        });
        console.log("[getAllTables] formatted sample:", formattedData.slice(0, 3));
        return {
            status: 200,
            body: {
                data: formattedData,
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
        console.error("[getAllTables] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch tables",
            },
        };
    }
};
exports.getAllTables = getAllTables;
const getTableByID = async ({ req }) => {
    try {
        const { tableID } = req.params;
        console.log("[getTableByID] tableID:", tableID);
        const table = await table_repository_1.default.getByID(tableID);
        console.log("[getTableByID] table:", table);
        if (!table) {
            console.log("[getTableByID] table not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        const formattedTable = {
            _id: table._id.toString(),
            name: table.name,
            capacity: table.capacity,
            status: table.status,
            section: table.sectionId?.name ?? null,
            sectionId: table.sectionId?._id?.toString(),
        };
        console.log("[getTableByID] formatted table:", formattedTable);
        return {
            status: 200,
            body: formattedTable,
        };
    }
    catch (error) {
        console.error("[getTableByID] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getTableByID = getTableByID;
exports.tableQueryHandler = {
    getAllTables: exports.getAllTables,
    getTableByID: exports.getTableByID,
};
