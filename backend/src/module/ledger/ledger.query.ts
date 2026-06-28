import { AppRouteQueryImplementation } from "@ts-rest/express";
import ledgerRepository from "../../repository/ledger.repository";
import { ledgerContract } from "../../contract/ledger/ledger.contract";


export const getAllCreditLedgers: AppRouteQueryImplementation<
  typeof ledgerContract.getAllCreditLedgers
> = async ({ req }) => {
  try {
    console.log("[GET ALL CREDIT LEDGERS] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const search = req.query.search as string | undefined;
    const type = req.query.type as string | undefined;
    const customerPhone = req.query.customerPhone as string | undefined;

    console.log("[GET ALL CREDIT LEDGERS] PARSED PARAMS:", {
      page,
      limit,
      search,
      type,
      customerPhone,
    });

    const skip = (page - 1) * limit;

    const { data, total } = await ledgerRepository.getAll({
      skip,
      limit,
      search,
      type,
      customerPhone,
    });

    const formattedData = data.map((ledger: any) => ({
      _id: ledger._id.toString(),
      voucherNo: ledger.voucherNo,
      customerName: ledger.customerName,
      customerPhone: ledger.customerPhone,
      customerEmail: ledger.customerEmail,
      date: ledger.date,
      type: ledger.type,
      amount: ledger.amount,
      description: ledger.description,
      reference: ledger.reference,
      remarks: ledger.remarks,
      createdBy: ledger.createdBy,
      createdAt: ledger.createdAt,
      updatedAt: ledger.updatedAt,
    }));

    console.log(
      "[GET ALL CREDIT LEDGERS] RESPONSE COUNT:",
      formattedData.length,
    );

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
    console.error("[GET ALL CREDIT LEDGERS] ERROR:", error);
    console.error("[GET ALL CREDIT LEDGERS] QUERY:", req.query);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch credit ledger entries",
      },
    };
  }
};

export const getCreditLedgerById: AppRouteQueryImplementation<
  typeof ledgerContract.getCreditLedgerByID
> = async ({ req }) => {
  try {
    console.log("[GET CREDIT LEDGER BY ID] PARAMS:", req.params);

    const { ledgerID } = req.params;

    const ledger =
      await ledgerRepository.getByID(ledgerID);

    console.log("[GET CREDIT LEDGER BY ID] DB RESULT:", ledger);

    if (!ledger) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Credit ledger not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: ledger._id.toString(),
        voucherNo: ledger.voucherNo,
        customerName: ledger.customerName,
        customerPhone: ledger.customerPhone,
        customerEmail: ledger.customerEmail,
        date: ledger.date,
        type: ledger.type,
        amount: ledger.amount,
        description: ledger.description,
        reference: ledger.reference,
        remarks: ledger.remarks,
        createdBy: ledger.createdBy,
        createdAt: ledger.createdAt,
        updatedAt: ledger.updatedAt,
      },
    };
  } catch (error) {
    console.error("[GET CREDIT LEDGER BY ID] ERROR:", error);
    console.error("[GET CREDIT LEDGER BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch credit ledger",
      },
    };
  }
};

export const creditLedgerQueryHandler = {
  getAllCreditLedgers,
  getCreditLedgerById,
};