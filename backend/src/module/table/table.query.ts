import { AppRouteQueryImplementation } from "@ts-rest/express";
import { tableContract } from "../../contract/table/table.contract";
import tableRepository from "../../repository/table.repository";

export const getAllTables: AppRouteQueryImplementation<
  typeof tableContract.getAllTables
> = async ({ req }) => {
  try {
    console.log("[getAllTables] query params:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    const search = req.query.search as string;
    const status = req.query.status as string;
    const sectionId = req.query.sectionId as string;

    console.log("[getAllTables] filters:", {
      page,
      limit,
      skip: (page - 1) * limit,
      search,
      status,
      sectionId,
    });

    const { data, total } = await tableRepository.getAll({
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

    const formattedData = data.map((table: any, index: number) => {
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
  } catch (error) {
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

export const getTableByID: AppRouteQueryImplementation<
  typeof tableContract.getTableByID
> = async ({ req }) => {
  try {
    const { tableID } = req.params;

    console.log("[getTableByID] tableID:", tableID);

    const table = await tableRepository.getByID(tableID);

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
      section: (table.sectionId as any)?.name ?? null,
      sectionId: (table.sectionId as any)?._id?.toString(),
    };

    console.log("[getTableByID] formatted table:", formattedTable);

    return {
      status: 200,
      body: formattedTable,
    };
  } catch (error) {
    console.error("[getTableByID] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const tableQueryHandler = {
  getAllTables,
  getTableByID,
};
