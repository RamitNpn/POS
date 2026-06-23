export interface TSalesReport {
  id: string;
  reportDate: string;
  totalRevenue: number;
  totalOrders: number;
  cashSales: number;
  onlineSales: number;
  totalDiscount: number;
  totalTax: number;
  generatedAt: string;
}
