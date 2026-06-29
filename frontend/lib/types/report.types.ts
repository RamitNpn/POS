export interface TSalesReport {
  id: string;
  reportDate: string;
  totalRevenue: number;
  totalOrders: number;
  totalExpense: number;
  cashSales: number;
  onlineSales: number;
  totalDiscount: number;
  totalTax: number;
  generatedAt: string;
}
