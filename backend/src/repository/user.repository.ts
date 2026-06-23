import UserModel, { IUser, UserRole } from "../model/user.model";

class UserRepository {
  private model;

  constructor() {
    this.model = UserModel;
  }

  async create(data: Partial<IUser>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async getAll({
    skip,
    limit,
    role,
    search,
  }: {
    skip: number;
    limit: number;
    role?: string;
    search?: string;
  }) {
    try {
      const query: any = {};

      if (role && role !== "all") {
        query.role = role;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      const data = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async getByEmail(email: string, includePassword = false) {
    try {
      const query = this.model.findOne({ email });
      return includePassword ? query.select("+password") : query;
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async getByRole(role: UserRole, includePassword = false) {
    try {
      const query = this.model.find({ role });

      return includePassword ? query.select("+password") : query;
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async update(id: string, data: Partial<IUser>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting users: ${error}`);
    }
  }
    async countByRole(roleId: string) {
    return this.model.countDocuments({ roleId });
  }
}

export default new UserRepository();
