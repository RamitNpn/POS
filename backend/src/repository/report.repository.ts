import DailyReportModel from "../model/report.model";

class DailyReportRepository {
  private model;

  constructor() {
    this.model = DailyReportModel;
  }

  async create(payload: any) {
    return DailyReportModel.create(payload);
  }

  async getByDate(reportDate: Date) {
    return DailyReportModel.findOne({
      reportDate,
    });
  }

  async getAll({
    limit,
    skip,
    from,
    to,
  }: {
    limit: number;
    skip: number;
    from?: string;
    to?: string;
  }) {

    const query: any = {};

    if (from || to) {
      query.reportDate = {};

      if (from) {
        query.reportDate.$gte = new Date(from);
      }

      if (to) {
        query.reportDate.$lte = new Date(to);
      }
    }

    console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

    const data = await this.model
      .find(query)
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(query);

    return { data, total };
  }
}

export const dailyReportRepository = new DailyReportRepository();
