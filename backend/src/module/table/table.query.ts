import { AppRouteQueryImplementation } from "@ts-rest/express";
import { tableContract } from "../../contract/table/table.contract";
import tableRepository from "../../repository/table.repository";
import roomRepository from "../../repository/room.repository";

export const getAllTables: AppRouteQueryImplementation<
  typeof tableContract.getAllTables
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await tableRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      status: req.query.status as string,
      sectionId: req.query.sectionId as string,
    });

    const formattedData = data.map((table: any) => ({
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
  } catch {
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
  const table = await tableRepository.getByID(req.params.tableID);

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
      section: (table.sectionId as any)?.name ?? null,
      sectionId: (table.sectionId as any)?._id?.toString(),
    },
  };
};

export const tableQueryHandler = {
  getAllTables,
  getTableByID,
};
