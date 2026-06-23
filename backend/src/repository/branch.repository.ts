import BranchModel, {
  IBranch,
} from "../model/branch.model";

class BranchRepository {
  private model;

  constructor() {
    this.model = BranchModel;
  }

  async create(data: Partial<IBranch>) {
    return this.model.create(data);
  }

  async getByID(id: string) {
    return this.model.findById(id);
  }

  async update(
    id: string,
    data: Partial<IBranch>,
  ) {
    return this.model.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      },
    );
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async getAll({
    skip,
    limit,
    search,
    status,
  }: {
    skip: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          managerName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const data = await this.model
      .find(filter)
      .sort({
        createdAt: -1,
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

export default new BranchRepository();