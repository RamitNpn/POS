export interface TSalesCategory {
  category: string;
  sales: number;
  percentage: number;
}

export interface TSalesAnalytics {
  totalRevenue: number;
  totalCategories: number;
  topCategory: string | null;
  salesByCategory: TSalesCategory[];
}

export interface TSalesItem {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface TTopSellingItems {
  topItem: string | null;
  topRevenue: number;
  totalItems: number;
  items: TSalesItem[];
}
