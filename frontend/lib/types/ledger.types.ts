export interface TLedger {
  voucherNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: Date;
  type: "debit" | "credit";
  amount: number;
  description?: string;
  reference?: string;
  remarks?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateLedger {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: Date;
  type: "debit" | "credit";
  amount: number;
  description?: string;
  reference?: string;
  remarks?: string;
  createdBy?: string;
}
