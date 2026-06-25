import ReservationModel, { IReservation } from "../model/reservation.model";

class ReservationRepository {
  private model = ReservationModel;

  async create(payload: Partial<IReservation>) {
    return this.model.create(payload);
  }

  async getByID(id: string) {
    return this.model.findById(id).populate("tableId");
  }

  async getByTableId(tableId: string) {
    return this.model.find({ tableId }).populate("tableId");
  }

  async getActiveReservationForToday(tableId: string) {
    const today = new Date().toISOString().split("T")[0];

    return this.model.findOne({
      tableId,
      date: { $gte: today },
      status: { $ne: "confirmed" },
    });
  }

  async update(id: string, payload: Partial<IReservation>) {
    return this.model.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async getAll({
    skip,
    limit,
    search,
    status,
    date,
  }: {
    skip: number;
    limit: number;
    search?: string;
    status?: string;
    date?: string;
  }) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      filter.date = date;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const data = await this.model
      .find(filter)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit)
      .populate("tableId");

    const total = await this.model.countDocuments(filter);

    return { data, total };
  }

  async getStats() {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };

    stats.forEach((s) => {
      result.total += s.count;

      if (s._id === "confirmed") result.confirmed = s.count;
      if (s._id === "pending") result.pending = s.count;
      if (s._id === "cancelled") result.cancelled = s.count;
    });

    return result;
  }
}

export default new ReservationRepository();
