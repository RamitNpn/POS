import CreditLedgerModel, { ICreditLedger } from "../model/ledger.model";

class CreditLedgerRepository {
  private model;

  constructor() {
    this.model = CreditLedgerModel;
  }

  async create(data: Partial<ICreditLedger>) {
    return this.model.create(data);
  }

  async getByID(id: string) {
    return this.model.findById(id);
  }

  async update(
    id: string,
    data: Partial<ICreditLedger>,
  ) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async getAll({
    skip,
    limit,
    search,
    type,
    customerPhone,
  }: {
    skip: number;
    limit: number;
    search?: string;
    type?: string;
    customerPhone?: string;
  }) {
    const filter: any = {};

    if (type && type !== "all") {
      filter.type = type;
    }

    if (customerPhone) {
      filter.customerPhone = customerPhone;
    }

    if (search) {
      filter.$or = [
        {
          voucherNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerPhone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i",
          },
        },
        {
          reference: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const data = await this.model
      .find(filter)
      .sort({
        date: -1,
      })
      .skip(skip)
      .limit(limit);

    const total =
      await this.model.countDocuments(filter);

    return {
      data,
      total,
    };
  }
}

export default new CreditLedgerRepository();