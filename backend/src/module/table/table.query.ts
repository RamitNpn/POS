import { AppRouteQueryImplementation } from "@ts-rest/express";
import { tableContract } from "../../contract/table/table.contract";
import tableRepository from "../../repository/table.repository";

export const getAllTables: AppRouteQueryImplementation<
  typeof tableContract.getAllTables
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } =
      await tableRepository.getAll({
        skip: (page - 1) * limit,
        limit,
        search: req.query.search as string,
        status: req.query.status as string,
        sectionId: req.query.sectionId as string,
      });

    return {
      status: 200,
      body: {
        data: data.map((table) => ({
          _id: table._id.toString(),
          name: table.name,
          capacity: table.capacity,
          status: table.status,
          section: table.section,
          sectionId: table.sectionId?.toString(),
        })),
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
  const table =
    await tableRepository.getByID(
      req.params.tableID,
    );

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
      section: table.section,
      sectionId: table.sectionId?.toString(),
    },
  };
};

export const tableQueryHandler = {
  getAllTables,
  getTableByID,
};