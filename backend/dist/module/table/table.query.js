"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableQueryHandler = exports.getTableByID = exports.getAllTables = void 0;
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const getAllTables = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const { data, total } = await table_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            status: req.query.status,
            sectionId: req.query.sectionId,
        });
        const formattedData = data.map((table) => ({
            _id: table._id.toString(),
            name: table.name,
            capacity: table.capacity,
            status: table.status,
            section: table.sectionId?.name ?? null,
            sectionId: table.sectionId?._id?.toString(),
        }));
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
    catch {
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
    const table = await table_repository_1.default.getByID(req.params.tableID);
    if (!table) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Table not found",
            },
        };
    }
    return {
        status: 200,
        body: {
            _id: table._id.toString(),
            name: table.name,
            capacity: table.capacity,
            status: table.status,
            section: table.sectionId?.name ?? null,
            sectionId: table.sectionId?._id?.toString(),
        },
    };
};
exports.getTableByID = getTableByID;
exports.tableQueryHandler = {
    getAllTables: exports.getAllTables,
    getTableByID: exports.getTableByID,
};
