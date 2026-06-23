export type BranchStatus = "active" | "inactive";

export interface TCreateBranch {
  name: string;
  address: string;
  phone: string;
  managerName: string;
  status: BranchStatus;
  opened: string;
}

export interface TBranch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  status: BranchStatus;
  opened: string;
  createdAt: Date;
  updatedAt: Date;
}
