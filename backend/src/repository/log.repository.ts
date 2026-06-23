import ActivityLogModel, { IActivityLog } from "../model/log.model";

class ActivityLogRepository {
  private model;

  constructor() {
    this.model = ActivityLogModel;
  }

  async create(data: Partial<IActivityLog>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating activity log: ${error}`);
    }
  }

  async getAll({
    skip,
    limit,
    search,
    module,
    userId,
  }: {
    skip: number;
    limit: number;
    search: string;
    module?: string;
    userId?: string;
  }) {
    try {
      const query: any = {};

      if (module) query.module = module;
      if (userId) query.userId = userId;

      if (search) {
        query.$or = [
          { action: { $regex: search, $options: "i" } },
          { details: { $regex: search, $options: "i" } },
          { module: { $regex: search, $options: "i" } },
        ];
      }

      const data = await this.model
        .find(query)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching activity logs: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model
        .findById(id)
        .populate("userId", "name email role");
    } catch (error) {
      throw new Error(`Error fetching activity log: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting activity log: ${error}`);
    }
  }
}

export default new ActivityLogRepository();
