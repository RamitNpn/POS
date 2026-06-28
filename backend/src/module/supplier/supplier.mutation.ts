import { AppRouteMutationImplementation } from "@ts-rest/express";
import supplierRepository from "../../repository/supplier.repository";
import { supplierContract } from "../../contract/supplier/supplier.contract";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createSupplier: AppRouteMutationImplementation<
  typeof supplierContract.createSupplier
> = async ({ req }) => {
  try {
    console.log("[createSupplier] request body:", req.body);

    const existing = await supplierRepository.getAll({
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

    const created = await supplierRepository.create(req.body);

    console.log("[createSupplier] created supplier:", created);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Create",
      details: `Supplier ${created.name} added at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Supplier",
      entityId: `${created._id}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Supplier created successfully",
      },
    };
  } catch (error) {
    console.error("[createSupplier] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateSupplier: AppRouteMutationImplementation<
  typeof supplierContract.updateSupplier
> = async ({ req }) => {
  try {
    const { supplierId } = req.params;

    console.log("[updateSupplier] supplierId:", supplierId);
    console.log("[updateSupplier] update payload:", req.body);

    const supplier = await supplierRepository.getByID(supplierId);

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

    await supplierRepository.update(supplierId, req.body);

    console.log("[updateSupplier] update successful");

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `Supplier ${supplier.name} updated at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Supplier",
      entityId: `${supplierId}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Supplier updated successfully",
      },
    };
  } catch (error) {
    console.error("[updateSupplier] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteSupplier: AppRouteMutationImplementation<
  typeof supplierContract.deleteSupplier
> = async ({ req }) => {
  try {
    const { supplierId } = req.params;

    console.log("[deleteSupplier] supplierId:", supplierId);

    const supplier = await supplierRepository.getByID(supplierId);

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

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `Supplier ${supplier.name} deleted at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Supplier",
      entityId: `${supplierId}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    await supplierRepository.delete(supplierId);

    console.log("[deleteSupplier] deletion successful");

    return {
      status: 200,
      body: {
        success: true,
        message: "Supplier deleted successfully",
      },
    };
  } catch (error) {
    console.error("[deleteSupplier] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const supplierMutationHandler = {
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
