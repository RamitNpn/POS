import DailyReportModel from "../model/report.model";

class DailyReportRepository {
  async create(payload: any) {
    return DailyReportModel.create(payload);
  }

  async getByDate(reportDate: Date) {
    return DailyReportModel.findOne({
      reportDate,
    });
  }

  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DailyReportModel.find().sort({ reportDate: -1 }).skip(skip).limit(limit),

      DailyReportModel.countDocuments(),
    ]);

    return {
      data,
      total,
    };
  }
}

export const dailyReportRepository = new DailyReportRepository();
