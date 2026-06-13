// User Roles
export type UserRole = 'admin' | 'waiter' | 'kitchen' | 'cashier';

// User Status
export type UserStatus = 'active' | 'inactive' | 'suspended';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// Extended User for management
export interface ManagedUser extends User {
  phone?: string;
  status: UserStatus;
  branchId?: string;
  lastLogin?: Date;
}

// Role with Permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: Date;
}

// Branch
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
}

// Order Status
export type OrderStatus = 
  | 'pending' 
  | 'preparing' 
  | 'ready' 
  | 'served' 
  | 'completed' 
  | 'cancelled';

// Payment Status
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Payment Method
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'split';

// Table Status
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out-of-service';

// Table Section
export interface TableSection {
  id: string;
  name: string;
  description?: string;
  tableCount: number;
  isActive: boolean;
}

// Menu Category
export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount?: number;
}

// Food Item Status
export type FoodItemStatus = 'available' | 'out-of-stock' | 'hidden';

// Menu Item
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: MenuCategory;
  image?: string;
  isAvailable: boolean;
  status: FoodItemStatus;
  preparationTime: number;
  allergens?: string[];
  tags?: string[];
  tax?: number;
  costPrice?: number;
}

// Menu Modifier
export interface MenuModifier {
  id: string;
  name: string;
  options: ModifierOption[];
  required: boolean;
  maxSelections: number;
  itemIds: string[];
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

// Order Item
export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  status: OrderStatus;
  price: number;
  modifiers?: ModifierOption[];
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  table: Table;
  items: OrderItem[];
  status: OrderStatus;
  customerName: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  tax: number;
  discount?: number;
  serviceCharge?: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  waiterId: string;
  waiter: User;
}

// Table
export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  section: string;
  sectionId?: string;
  positionX?: number;
  positionY?: number;
}

// Reservation
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: Date;
  time: string;
  partySize: number;
  tableId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  createdAt: Date;
}

// Staff Member (extends User with additional fields)
export interface StaffMember extends User {
  phone?: string;
  hireDate: Date;
  salary?: number;
  isActive: boolean;
  shifts?: Shift[];
  branchId?: string;
}

// Shift
export interface Shift {
  id: string;
  staffId: string;
  startTime: Date;
  endTime: Date;
  date: Date;
}

// Inventory / Ingredients
export interface Ingredient {
  id: string;
  sku: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierId?: string;
  expiryDate?: Date;
  lastRestocked?: Date;
  category: string;
}

// Stock Movement
export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  type: 'in' | 'out' | 'adjustment' | 'waste';
  quantity: number;
  reason: string;
  userId: string;
  user?: User;
  createdAt: Date;
  referenceNumber?: string;
}

// Supplier
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
}

// Purchase Order
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  items: PurchaseOrderItem[];
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  totalAmount: number;
  expectedDate?: Date;
  receivedDate?: Date;
  notes?: string;
  createdAt: Date;
  createdBy: string;
}

export interface PurchaseOrderItem {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

// Recipe
export interface Recipe {
  id: string;
  menuItemId: string;
  menuItem?: MenuItem;
  ingredients: RecipeIngredient[];
  instructions?: string;
  yield: number;
  yieldUnit: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unit: string;
}

// Finance - Expense
export interface Expense {
  id: string;
  category: 'purchases' | 'salary' | 'utilities' | 'rent' | 'maintenance' | 'marketing' | 'other';
  description: string;
  amount: number;
  date: Date;
  paymentMethod: PaymentMethod;
  vendorName?: string;
  receiptUrl?: string;
  createdBy: string;
  createdAt: Date;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  timestamp: Date;
  module?: string;
  entityId?: string;
  entityType?: string;
  ipAddress?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeOrders: number;
  occupiedTables: number;
  totalTables: number;
  revenueChange: number;
  ordersChange: number;
}

// Extended Admin Dashboard Stats
export interface AdminDashboardStats extends DashboardStats {
  pendingBills: number;
  lowStockAlerts: number;
  activeKitchenOrders: number;
  todayRevenue: number;
  todayOrders: number;
  reservationsToday: number;
}

// Revenue Data for Charts
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

// Sales by Category
export interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

// Top Selling Item
export interface TopSellingItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

// Peak Hours Data
export interface PeakHoursData {
  hour: string;
  orders: number;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'system' | 'inventory' | 'orders' | 'finance';
  read: boolean;
  archived: boolean;
  createdAt: Date;
}

// Navigation Item
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles: UserRole[];
}

// Navigation Group
export interface NavGroup {
  title: string;
  items: NavItem[];
  roles: UserRole[];
}

// Settings
export interface RestaurantSettings {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  vatNumber?: string;
  currency: string;
  taxRate: number;
  serviceChargeRate: number;
  timezone: string;
}

export interface PrinterSettings {
  kitchenPrinter: {
    enabled: boolean;
    name: string;
    ipAddress: string;
  };
  billingPrinter: {
    enabled: boolean;
    name: string;
    ipAddress: string;
  };
}

// API Response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Options
export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Report Types
export type ReportType = 'sales' | 'inventory' | 'staff' | 'tax' | 'orders';
export type ReportPeriod = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'lastYear' | 'custom';
export type ExportFormat = 'pdf' | 'excel' | 'csv';
