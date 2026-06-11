import type {
  User,
  ManagedUser,
  Role,
  Permission,
  Branch,
  Order,
  Table,
  TableSection,
  MenuItem,
  MenuCategory,
  MenuModifier,
  DashboardStats,
  AdminDashboardStats,
  RevenueData,
  SalesByCategory,
  TopSellingItem,
  PeakHoursData,
  ActivityLog,
  Notification,
  StaffMember,
  Ingredient,
  StockMovement,
  Supplier,
  PurchaseOrder,
  Recipe,
  Expense,
  Reservation,
} from "@/lib/types";

// Permissions
export const mockPermissions: Permission[] = [
  {
    id: "perm-1",
    name: "view_dashboard",
    description: "View dashboard",
    module: "Dashboard",
  },
  {
    id: "perm-2",
    name: "manage_users",
    description: "Create, edit, delete users",
    module: "Users",
  },
  {
    id: "perm-3",
    name: "manage_roles",
    description: "Manage roles and permissions",
    module: "Roles",
  },
  {
    id: "perm-4",
    name: "view_orders",
    description: "View orders",
    module: "Orders",
  },
  {
    id: "perm-5",
    name: "create_orders",
    description: "Create new orders",
    module: "Orders",
  },
  {
    id: "perm-6",
    name: "edit_orders",
    description: "Edit orders",
    module: "Orders",
  },
  {
    id: "perm-7",
    name: "cancel_orders",
    description: "Cancel orders",
    module: "Orders",
  },
  {
    id: "perm-8",
    name: "view_menu",
    description: "View menu items",
    module: "Menu",
  },
  {
    id: "perm-9",
    name: "manage_menu",
    description: "Create, edit, delete menu items",
    module: "Menu",
  },
  {
    id: "perm-10",
    name: "view_tables",
    description: "View tables",
    module: "Tables",
  },
  {
    id: "perm-11",
    name: "manage_tables",
    description: "Manage table status",
    module: "Tables",
  },
  {
    id: "perm-12",
    name: "view_inventory",
    description: "View inventory",
    module: "Inventory",
  },
  {
    id: "perm-13",
    name: "manage_inventory",
    description: "Manage inventory",
    module: "Inventory",
  },
  {
    id: "perm-14",
    name: "view_reports",
    description: "View reports",
    module: "Reports",
  },
  {
    id: "perm-15",
    name: "export_reports",
    description: "Export reports",
    module: "Reports",
  },
  {
    id: "perm-16",
    name: "view_finance",
    description: "View finance data",
    module: "Finance",
  },
  {
    id: "perm-17",
    name: "manage_finance",
    description: "Manage finances",
    module: "Finance",
  },
  {
    id: "perm-18",
    name: "manage_settings",
    description: "Manage system settings",
    module: "Settings",
  },
];

// Roles
export const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Administrator",
    description: "Full system access",
    permissions: mockPermissions.map((p) => p.id),
    userCount: 2,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "role-2",
    name: "Manager",
    description: "Restaurant management access",
    permissions: [
      "perm-1",
      "perm-4",
      "perm-5",
      "perm-6",
      "perm-8",
      "perm-9",
      "perm-10",
      "perm-11",
      "perm-12",
      "perm-14",
    ],
    userCount: 3,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "role-3",
    name: "Server",
    description: "Order and table management",
    permissions: ["perm-1", "perm-4", "perm-5", "perm-8", "perm-10", "perm-11"],
    userCount: 8,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "role-4",
    name: "Kitchen Staff",
    description: "Kitchen order management",
    permissions: ["perm-4", "perm-6", "perm-8"],
    userCount: 5,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "role-5",
    name: "Cashier",
    description: "Payment processing",
    permissions: ["perm-1", "perm-4", "perm-10", "perm-14"],
    userCount: 4,
    createdAt: new Date("2024-02-01"),
  },
];

// Branches
export const mockBranches: Branch[] = [
  {
    id: "branch-1",
    name: "DineFlow Downtown",
    address: "123 Main Street, Downtown City",
    phone: "555-0100",
    email: "downtown@dineflow.com",
    managerId: "1",
    isActive: true,
    createdAt: new Date("2023-06-01"),
  },
  {
    id: "branch-2",
    name: "DineFlow Mall",
    address: "456 Shopping Center, Mall Plaza",
    phone: "555-0200",
    email: "mall@dineflow.com",
    managerId: "2",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
];

// Menu Categories
export const mockCategories: MenuCategory[] = [
  {
    id: "cat-1",
    name: "Appetizers",
    description: "Start your meal right",
    sortOrder: 1,
    isActive: true,
    itemCount: 5,
  },
  {
    id: "cat-2",
    name: "Main Course",
    description: "Signature dishes",
    sortOrder: 2,
    isActive: true,
    itemCount: 8,
  },
  {
    id: "cat-3",
    name: "Pasta",
    description: "Fresh homemade pasta",
    sortOrder: 3,
    isActive: true,
    itemCount: 6,
  },
  {
    id: "cat-4",
    name: "Desserts",
    description: "Sweet endings",
    sortOrder: 4,
    isActive: true,
    itemCount: 4,
  },
  {
    id: "cat-5",
    name: "Beverages",
    description: "Drinks and cocktails",
    sortOrder: 5,
    isActive: true,
    itemCount: 10,
  },
  {
    id: "cat-6",
    name: "Salads",
    description: "Fresh and healthy",
    sortOrder: 6,
    isActive: true,
    itemCount: 4,
  },
];

// Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Bruschetta",
    description: "Toasted bread with fresh tomatoes, garlic, and basil",
    price: 12.99,
    categoryId: "cat-1",
    isAvailable: true,
    status: "available",
    preparationTime: 10,
    allergens: ["gluten"],
    tags: ["vegetarian"],
    tax: 10,
    costPrice: 4.5,
    image:
      "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-2",
    name: "Calamari Fritti",
    description: "Crispy fried squid with marinara sauce",
    price: 16.99,
    categoryId: "cat-1",
    isAvailable: true,
    status: "available",
    preparationTime: 15,
    allergens: ["shellfish", "gluten"],
    tax: 10,
    costPrice: 6.0,
    image:
    "https://images.unsplash.com/photo-1579670039509-e21e75007e4c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "item-3",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce and vegetables",
    price: 32.99,
    categoryId: "cat-2",
    isAvailable: true,
    status: "available",
    preparationTime: 25,
    allergens: ["fish"],
    tags: ["healthy", "gluten-free"],
    tax: 10,
    costPrice: 14.0,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-4",
    name: "Ribeye Steak",
    description: "12oz prime ribeye with herb butter and fries",
    price: 45.99,
    categoryId: "cat-2",
    isAvailable: true,
    status: "available",
    preparationTime: 30,
    tags: ["signature"],
    tax: 10,
    costPrice: 18.0,
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-5",
    name: "Fettuccine Alfredo",
    description: "Creamy parmesan sauce with fresh fettuccine",
    price: 22.99,
    categoryId: "cat-3",
    isAvailable: true,
    status: "available",
    preparationTime: 20,
    allergens: ["gluten", "dairy"],
    tags: ["vegetarian"],
    tax: 10,
    costPrice: 7.0,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-6",
    name: "Spaghetti Carbonara",
    description: "Classic Roman pasta with pancetta and egg",
    price: 24.99,
    categoryId: "cat-3",
    isAvailable: true,
    status: "available",
    preparationTime: 18,
    allergens: ["gluten", "dairy", "eggs"],
    tax: 10,
    costPrice: 8.0,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-7",
    name: "Tiramisu",
    description: "Classic Italian coffee dessert",
    price: 10.99,
    categoryId: "cat-4",
    isAvailable: true,
    status: "available",
    preparationTime: 5,
    allergens: ["dairy", "eggs", "gluten"],
    tax: 10,
    costPrice: 3.5,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-8",
    name: "Panna Cotta",
    description: "Vanilla cream with berry compote",
    price: 9.99,
    categoryId: "cat-4",
    isAvailable: true,
    status: "available",
    preparationTime: 5,
    allergens: ["dairy"],
    tags: ["gluten-free"],
    tax: 10,
    costPrice: 3.0,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-9",
    name: "House Red Wine",
    description: "Glass of signature Chianti",
    price: 12.0,
    categoryId: "cat-5",
    isAvailable: true,
    status: "available",
    preparationTime: 2,
    tax: 15,
    costPrice: 4.0,
    image:
      "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-10",
    name: "Espresso",
    description: "Double shot Italian espresso",
    price: 4.5,
    categoryId: "cat-5",
    isAvailable: true,
    status: "available",
    preparationTime: 3,
    tax: 10,
    costPrice: 0.8,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-11",
    name: "Caesar Salad",
    description: "Romaine lettuce with caesar dressing and croutons",
    price: 14.99,
    categoryId: "cat-6",
    isAvailable: true,
    status: "available",
    preparationTime: 8,
    allergens: ["gluten", "dairy", "eggs"],
    tax: 10,
    costPrice: 5.0,
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "item-12",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara and mozzarella",
    price: 28.99,
    categoryId: "cat-2",
    isAvailable: false,
    status: "out-of-stock",
    preparationTime: 25,
    allergens: ["gluten", "dairy"],
    tax: 10,
    costPrice: 10.0,
    image:
      "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?auto=format&fit=crop&w=800&q=80",
  },
];

// Menu Modifiers
export const mockModifiers: MenuModifier[] = [
  {
    id: "mod-1",
    name: "Cooking Temperature",
    options: [
      { id: "opt-1", name: "Rare", price: 0 },
      { id: "opt-2", name: "Medium Rare", price: 0 },
      { id: "opt-3", name: "Medium", price: 0 },
      { id: "opt-4", name: "Medium Well", price: 0 },
      { id: "opt-5", name: "Well Done", price: 0 },
    ],
    required: true,
    maxSelections: 1,
    itemIds: ["item-4"],
  },
  {
    id: "mod-2",
    name: "Add Extra",
    options: [
      { id: "opt-6", name: "Extra Cheese", price: 2.5 },
      { id: "opt-7", name: "Bacon", price: 3.0 },
      { id: "opt-8", name: "Mushrooms", price: 2.0 },
    ],
    required: false,
    maxSelections: 3,
    itemIds: ["item-4", "item-5", "item-6"],
  },
  {
    id: "mod-3",
    name: "Side Choice",
    options: [
      { id: "opt-9", name: "Fries", price: 0 },
      { id: "opt-10", name: "Mashed Potatoes", price: 0 },
      { id: "opt-11", name: "Vegetables", price: 0 },
      { id: "opt-12", name: "Salad", price: 1.5 },
    ],
    required: true,
    maxSelections: 1,
    itemIds: ["item-3", "item-4", "item-12"],
  },
];

// Table Sections
export const mockSections: TableSection[] = [
  {
    id: "sec-1",
    name: "Main Dining",
    description: "Main dining area",
    tableCount: 6,
    isActive: true,
  },
  {
    id: "sec-2",
    name: "Patio",
    description: "Outdoor seating",
    tableCount: 3,
    isActive: true,
  },
  {
    id: "sec-3",
    name: "Bar",
    description: "Bar area seating",
    tableCount: 2,
    isActive: true,
  },
  {
    id: "sec-4",
    name: "Private",
    description: "Private dining room",
    tableCount: 1,
    isActive: true,
  },
];

// Tables
export const mockTables: Table[] = [
  {
    id: "table-1",
    number: 1,
    capacity: 2,
    status: "available",
    section: "Main",
    sectionId: "sec-1",
    positionX: 10,
    positionY: 10,
  },
  {
    id: "table-2",
    number: 2,
    capacity: 2,
    status: "occupied",
    section: "Main",
    sectionId: "sec-1",
    currentOrderId: "order-1",
    positionX: 30,
    positionY: 10,
  },
  {
    id: "table-3",
    number: 3,
    capacity: 4,
    status: "occupied",
    section: "Main",
    sectionId: "sec-1",
    currentOrderId: "order-2",
    positionX: 50,
    positionY: 10,
  },
  {
    id: "table-4",
    number: 4,
    capacity: 4,
    status: "reserved",
    section: "Main",
    sectionId: "sec-1",
    positionX: 10,
    positionY: 40,
  },
  {
    id: "table-5",
    number: 5,
    capacity: 6,
    status: "available",
    section: "Main",
    sectionId: "sec-1",
    positionX: 30,
    positionY: 40,
  },
  {
    id: "table-6",
    number: 6,
    capacity: 6,
    status: "cleaning",
    section: "Main",
    sectionId: "sec-1",
    positionX: 50,
    positionY: 40,
  },
  {
    id: "table-7",
    number: 7,
    capacity: 8,
    status: "occupied",
    section: "Patio",
    sectionId: "sec-2",
    currentOrderId: "order-3",
    positionX: 10,
    positionY: 70,
  },
  {
    id: "table-8",
    number: 8,
    capacity: 4,
    status: "available",
    section: "Patio",
    sectionId: "sec-2",
    positionX: 30,
    positionY: 70,
  },
  {
    id: "table-9",
    number: 9,
    capacity: 4,
    status: "occupied",
    section: "Patio",
    sectionId: "sec-2",
    currentOrderId: "order-4",
    positionX: 50,
    positionY: 70,
  },
  {
    id: "table-10",
    number: 10,
    capacity: 2,
    status: "available",
    section: "Bar",
    sectionId: "sec-3",
    positionX: 70,
    positionY: 10,
  },
  {
    id: "table-11",
    number: 11,
    capacity: 2,
    status: "occupied",
    section: "Bar",
    sectionId: "sec-3",
    currentOrderId: "order-5",
    positionX: 70,
    positionY: 30,
  },
  {
    id: "table-12",
    number: 12,
    capacity: 10,
    status: "reserved",
    section: "Private",
    sectionId: "sec-4",
    positionX: 70,
    positionY: 60,
  },
];

// Reservations
export const mockReservations: Reservation[] = [
  {
    id: "res-1",
    customerName: "John Smith",
    customerPhone: "555-1234",
    customerEmail: "john@example.com",
    date: new Date(),
    time: "19:00",
    partySize: 4,
    tableId: "table-4",
    status: "confirmed",
    notes: "Anniversary dinner",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "res-2",
    customerName: "Corporate Event",
    customerPhone: "555-5678",
    customerEmail: "events@company.com",
    date: new Date(),
    time: "18:30",
    partySize: 10,
    tableId: "table-12",
    status: "confirmed",
    notes: "Business dinner - VIP",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "res-3",
    customerName: "Maria Garcia",
    customerPhone: "555-9012",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "20:00",
    partySize: 2,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Mock Staff / Managed Users
export const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "admin@dineflow.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    hireDate: new Date("2023-06-15"),
    isActive: true,
    phone: "555-0101",
    branchId: "branch-1",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@dineflow.com",
    role: "waiter",
    createdAt: new Date("2024-02-15"),
    hireDate: new Date("2024-01-10"),
    isActive: true,
    phone: "555-0102",
    branchId: "branch-1",
  },
  {
    id: "5",
    name: "Lisa Park",
    email: "lisa@dineflow.com",
    role: "waiter",
    createdAt: new Date("2024-03-01"),
    hireDate: new Date("2024-02-20"),
    isActive: true,
    phone: "555-0105",
    branchId: "branch-1",
  },
  {
    id: "3",
    name: "Antonio Rossi",
    email: "kitchen@dineflow.com",
    role: "kitchen",
    createdAt: new Date("2024-01-10"),
    hireDate: new Date("2023-08-01"),
    isActive: true,
    phone: "555-0103",
    branchId: "branch-1",
  },
  {
    id: "6",
    name: "Maria Garcia",
    email: "maria@dineflow.com",
    role: "kitchen",
    createdAt: new Date("2024-01-15"),
    hireDate: new Date("2023-09-15"),
    isActive: true,
    phone: "555-0106",
    branchId: "branch-1",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "cashier@dineflow.com",
    role: "cashier",
    createdAt: new Date("2024-03-01"),
    hireDate: new Date("2024-02-01"),
    isActive: true,
    phone: "555-0104",
    branchId: "branch-1",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james@dineflow.com",
    role: "waiter",
    createdAt: new Date("2024-04-01"),
    hireDate: new Date("2024-03-15"),
    isActive: false,
    phone: "555-0107",
    branchId: "branch-2",
  },
];

export const mockManagedUsers: ManagedUser[] = mockStaff.map((staff) => ({
  ...staff,
  status: staff.isActive ? "active" : "inactive",
  lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
}));

// Helper to get user by ID
const getUserById = (id: string): User => {
  const staff = mockStaff.find((s) => s.id === id);
  return staff || mockStaff[0];
};

// Helper to get table by ID
const getTableById = (id: string): Table => {
  return mockTables.find((t) => t.id === id) || mockTables[0];
};

// Helper to get menu item by ID
const getMenuItemById = (id: string): MenuItem => {
  return mockMenuItems.find((m) => m.id === id) || mockMenuItems[0];
};

// Orders
export const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "#1042",
    tableId: "table-2",
    table: getTableById("table-2"),
    customerName: "John Smith",
    status: "preparing",
    paymentStatus: "pending",
    items: [
      {
        id: "oi-1",
        menuItemId: "item-1",
        menuItem: getMenuItemById("item-1"),
        quantity: 2,
        status: "ready",
        price: 12.99,
      },
      {
        id: "oi-2",
        menuItemId: "item-4",
        menuItem: getMenuItemById("item-4"),
        quantity: 1,
        status: "preparing",
        price: 45.99,
        notes: "Medium rare",
      },
      {
        id: "oi-3",
        menuItemId: "item-9",
        menuItem: getMenuItemById("item-9"),
        quantity: 2,
        status: "served",
        price: 12.0,
      },
    ],
    subtotal: 95.97,
    tax: 9.6,
    total: 105.57,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    waiterId: "2",
    waiter: getUserById("2"),
  },
  {
    id: "order-2",
    orderNumber: "#1043",
    tableId: "table-3",
    table: getTableById("table-3"),
    customerName: "Corporate Event",
    status: "pending",
    paymentStatus: "pending",
    items: [
      {
        id: "oi-4",
        menuItemId: "item-2",
        menuItem: getMenuItemById("item-2"),
        quantity: 1,
        status: "pending",
        price: 16.99,
      },
      {
        id: "oi-5",
        menuItemId: "item-5",
        menuItem: getMenuItemById("item-5"),
        quantity: 2,
        status: "pending",
        price: 22.99,
      },
      {
        id: "oi-6",
        menuItemId: "item-7",
        menuItem: getMenuItemById("item-7"),
        quantity: 2,
        status: "pending",
        price: 10.99,
      },
    ],
    subtotal: 84.95,
    tax: 8.5,
    total: 93.45,
    createdAt: new Date(Date.now() - 1 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000),  
    waiterId: "5",
    waiter: getUserById("5"),
  },
  {
    id: "order-3",
    orderNumber: "#1044",
    tableId: "table-7",
    table: getTableById("table-7"),
    customerName: "Maria Garcia",
    status: "ready",
    paymentStatus: "pending",
    items: [
      {
        id: "oi-7",
        menuItemId: "item-3",
        menuItem: getMenuItemById("item-3"),
        quantity: 2,
        status: "ready",
        price: 32.99,
      },
      {
        id: "oi-8",
        menuItemId: "item-6",
        menuItem: getMenuItemById("item-6"),
        quantity: 1,
        status: "ready",
        price: 24.99,
      },
    ],
    subtotal: 90.97,
    tax: 9.1,
    total: 100.07,
    createdAt: new Date(Date.now() - 40 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
    waiterId: "2",
    waiter: getUserById("2"),
    notes: "Birthday celebration",
  },
  {
    id: "order-4",
    orderNumber: "#1045",
    tableId: "table-9",
    table: getTableById("table-9"),
    customerName: "John Doe",
    status: "served",
    paymentStatus: "pending",
    items: [
      {
        id: "oi-9",
        menuItemId: "item-4",
        menuItem: getMenuItemById("item-4"),
        quantity: 2,
        status: "served",
        price: 45.99,
        notes: "One well done",
      },
      {
        id: "oi-10",
        menuItemId: "item-8",
        menuItem: getMenuItemById("item-8"),
        quantity: 2,
        status: "served",
        price: 9.99,
      },
      {
        id: "oi-11",
        menuItemId: "item-10",
        menuItem: getMenuItemById("item-10"),
        quantity: 2,
        status: "served",
        price: 4.5,
      },
    ],
    subtotal: 120.96,
    tax: 12.1,
    total: 133.06,
    createdAt: new Date(Date.now() - 55 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    waiterId: "5",
    waiter: getUserById("5"),
  },
  {
    id: "order-5",
    orderNumber: "#1046",
    tableId: "table-11",
    table: getTableById("table-11"),
    customerName: "Emily Rodriguez",
    status: "preparing",
    paymentStatus: "pending",
    items: [
      {
        id: "oi-12",
        menuItemId: "item-1",
        menuItem: getMenuItemById("item-1"),
        quantity: 1,
        status: "ready",
        price: 12.99,
      },
      {
        id: "oi-13",
        menuItemId: "item-9",
        menuItem: getMenuItemById("item-9"),
        quantity: 2,
        status: "served",
        price: 12.0,
      },
    ],
    subtotal: 36.99,
    tax: 3.7,
    total: 40.69,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000),
    waiterId: "2",
    waiter: getUserById("2"),
  },
];

// Completed Orders
export const mockCompletedOrders: Order[] = [
  {
    id: "order-c1",
    orderNumber: "#1038",
    tableId: "table-1",
    table: getTableById("table-1"),
    customerName: "John Smith",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "card",
    items: [
      {
        id: "oi-c1",
        menuItemId: "item-3",
        menuItem: getMenuItemById("item-3"),
        quantity: 2,
        status: "completed",
        price: 32.99,
      },
    ],
    subtotal: 65.98,
    tax: 6.6,
    total: 72.58,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    waiterId: "2",
    waiter: getUserById("2"),
  },
];

// Ingredients
export const mockIngredients: Ingredient[] = [
  {
    id: "ing-1",
    sku: "ING-001",
    name: "Tomatoes",
    unit: "kg",
    currentStock: 15,
    minimumStock: 5,
    reorderLevel: 10,
    costPerUnit: 3.5,
    category: "Vegetables",
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-2",
    sku: "ING-002",
    name: "Mozzarella Cheese",
    unit: "kg",
    currentStock: 8,
    minimumStock: 3,
    reorderLevel: 5,
    costPerUnit: 12.0,
    category: "Dairy",
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-3",
    sku: "ING-003",
    name: "Olive Oil",
    unit: "L",
    currentStock: 12,
    minimumStock: 4,
    reorderLevel: 6,
    costPerUnit: 8.5,
    category: "Oils",
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-4",
    sku: "ING-004",
    name: "Ribeye Steak",
    unit: "kg",
    currentStock: 4,
    minimumStock: 5,
    reorderLevel: 8,
    costPerUnit: 35.0,
    category: "Meat",
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-5",
    sku: "ING-005",
    name: "Salmon Fillet",
    unit: "kg",
    currentStock: 6,
    minimumStock: 3,
    reorderLevel: 5,
    costPerUnit: 28.0,
    category: "Seafood",
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-6",
    sku: "ING-006",
    name: "House Red Wine",
    unit: "bottles",
    currentStock: 3,
    minimumStock: 10,
    reorderLevel: 15,
    costPerUnit: 15.0,
    category: "Beverages",
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-7",
    sku: "ING-007",
    name: "Fresh Basil",
    unit: "bunches",
    currentStock: 20,
    minimumStock: 8,
    reorderLevel: 12,
    costPerUnit: 2.0,
    category: "Herbs",
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-8",
    sku: "ING-008",
    name: "Parmesan",
    unit: "kg",
    currentStock: 5,
    minimumStock: 2,
    reorderLevel: 4,
    costPerUnit: 25.0,
    category: "Dairy",
    lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-9",
    sku: "ING-009",
    name: "Fresh Pasta",
    unit: "kg",
    currentStock: 10,
    minimumStock: 5,
    reorderLevel: 8,
    costPerUnit: 6.0,
    category: "Pasta",
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ing-10",
    sku: "ING-010",
    name: "Garlic",
    unit: "kg",
    currentStock: 3,
    minimumStock: 2,
    reorderLevel: 4,
    costPerUnit: 8.0,
    category: "Vegetables",
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Stock Movement
export const mockStockMovements: StockMovement[] = [
  {
    id: "sm-1",
    ingredientId: "ing-4",
    type: "out",
    quantity: 2,
    reason: "Used in orders",
    userId: "3",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "sm-2",
    ingredientId: "ing-6",
    type: "out",
    quantity: 5,
    reason: "Sold",
    userId: "2",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "sm-3",
    ingredientId: "ing-1",
    type: "in",
    quantity: 10,
    reason: "Restocked",
    userId: "1",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    referenceNumber: "PO-001",
  },
  {
    id: "sm-4",
    ingredientId: "ing-2",
    type: "waste",
    quantity: 1,
    reason: "Expired",
    userId: "3",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

// Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Fresh Farms Co.",
    contactPerson: "John Farmer",
    email: "john@freshfarms.com",
    phone: "555-1111",
    address: "123 Farm Road",
    isActive: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "sup-2",
    name: "Ocean Catch Seafood",
    contactPerson: "Mike Fisher",
    email: "mike@oceancatch.com",
    phone: "555-2222",
    address: "456 Harbor St",
    isActive: true,
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "sup-3",
    name: "Premium Meats Ltd",
    contactPerson: "Steve Butcher",
    email: "steve@premiummeats.com",
    phone: "555-3333",
    address: "789 Market Ave",
    isActive: true,
    createdAt: new Date("2023-02-10"),
  },
  {
    id: "sup-4",
    name: "Wine Cellar Imports",
    contactPerson: "Sofia Vino",
    email: "sofia@winecellar.com",
    phone: "555-4444",
    address: "321 Vineyard Ln",
    isActive: true,
    createdAt: new Date("2023-04-05"),
  },
];

// Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    orderNumber: "PO-2024-001",
    supplierId: "sup-1",
    supplier: mockSuppliers[0],
    items: [
      {
        id: "poi-1",
        ingredientId: "ing-1",
        quantity: 20,
        unitPrice: 3.5,
        totalPrice: 70.0,
      },
      {
        id: "poi-2",
        ingredientId: "ing-7",
        quantity: 15,
        unitPrice: 2.0,
        totalPrice: 30.0,
      },
    ],
    status: "pending",
    totalAmount: 100.0,
    expectedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: "1",
  },
  {
    id: "po-2",
    orderNumber: "PO-2024-002",
    supplierId: "sup-4",
    supplier: mockSuppliers[3],
    items: [
      {
        id: "poi-3",
        ingredientId: "ing-6",
        quantity: 24,
        unitPrice: 15.0,
        totalPrice: 360.0,
      },
    ],
    status: "approved",
    totalAmount: 360.0,
    expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: "1",
  },
];

// Recipes
export const mockRecipes: Recipe[] = [
  {
    id: "rec-1",
    menuItemId: "item-1",
    menuItem: getMenuItemById("item-1"),
    ingredients: [
      { ingredientId: "ing-1", quantity: 0.2, unit: "kg" },
      { ingredientId: "ing-7", quantity: 1, unit: "bunch" },
      { ingredientId: "ing-10", quantity: 0.02, unit: "kg" },
      { ingredientId: "ing-3", quantity: 0.03, unit: "L" },
    ],
    yield: 1,
    yieldUnit: "portion",
    instructions:
      "Toast bread, dice tomatoes, chop basil, mix with garlic and olive oil.",
  },
];

// Expenses
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    category: "purchases",
    description: "Weekly produce delivery",
    amount: 850.0,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    paymentMethod: "card",
    vendorName: "Fresh Farms Co.",
    createdBy: "1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-2",
    category: "utilities",
    description: "Electricity bill - June",
    amount: 420.0,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paymentMethod: "card",
    createdBy: "1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-3",
    category: "rent",
    description: "Monthly rent",
    amount: 5500.0,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    paymentMethod: "card",
    createdBy: "1",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-4",
    category: "salary",
    description: "Staff wages - Week 23",
    amount: 8200.0,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    paymentMethod: "card",
    createdBy: "1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-5",
    category: "maintenance",
    description: "Kitchen equipment repair",
    amount: 350.0,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    paymentMethod: "cash",
    vendorName: "QuickFix Services",
    createdBy: "1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 4825.5,
  totalOrders: 47,
  averageOrderValue: 102.67,
  activeOrders: 5,
  occupiedTables: 5,
  totalTables: 12,
  revenueChange: 12.5,
  ordersChange: 8.3,
};

// Admin Dashboard Stats
export const mockAdminDashboardStats: AdminDashboardStats = {
  ...mockDashboardStats,
  todayRevenue: 2450.75,
  todayOrders: 28,
  pendingBills: 4,
  lowStockAlerts: 3,
  activeKitchenOrders: 4,
  reservationsToday: 5,
};

// Revenue Data for Charts (last 7 days)
export const mockRevenueData: RevenueData[] = [
  { date: "Mon", revenue: 3200, orders: 32 },
  { date: "Tue", revenue: 2800, orders: 28 },
  { date: "Wed", revenue: 3500, orders: 35 },
  { date: "Thu", revenue: 4100, orders: 41 },
  { date: "Fri", revenue: 5200, orders: 52 },
  { date: "Sat", revenue: 6100, orders: 61 },
  { date: "Sun", revenue: 4825, orders: 47 },
];

// Monthly Revenue Data
export const mockMonthlyRevenueData: RevenueData[] = [
  { date: "Jan", revenue: 85000, orders: 820 },
  { date: "Feb", revenue: 78000, orders: 750 },
  { date: "Mar", revenue: 92000, orders: 890 },
  { date: "Apr", revenue: 88000, orders: 845 },
  { date: "May", revenue: 95000, orders: 920 },
  { date: "Jun", revenue: 102000, orders: 985 },
];

// Sales by Category
export const mockSalesByCategory: SalesByCategory[] = [
  { category: "Main Course", sales: 12500, percentage: 38 },
  { category: "Pasta", sales: 8200, percentage: 25 },
  { category: "Appetizers", sales: 5100, percentage: 15 },
  { category: "Beverages", sales: 4200, percentage: 13 },
  { category: "Desserts", sales: 2800, percentage: 9 },
];

// Top Selling Items
export const mockTopSellingItems: TopSellingItem[] = [
  { id: "item-4", name: "Ribeye Steak", quantity: 156, revenue: 7174.44 },
  { id: "item-3", name: "Grilled Salmon", quantity: 142, revenue: 4684.58 },
  { id: "item-5", name: "Fettuccine Alfredo", quantity: 128, revenue: 2942.72 },
  { id: "item-1", name: "Bruschetta", quantity: 98, revenue: 1273.02 },
  { id: "item-6", name: "Spaghetti Carbonara", quantity: 87, revenue: 2174.13 },
];

// Peak Hours Data
export const mockPeakHoursData: PeakHoursData[] = [
  { hour: "11:00", orders: 8 },
  { hour: "12:00", orders: 24 },
  { hour: "13:00", orders: 32 },
  { hour: "14:00", orders: 18 },
  { hour: "15:00", orders: 6 },
  { hour: "16:00", orders: 4 },
  { hour: "17:00", orders: 10 },
  { hour: "18:00", orders: 28 },
  { hour: "19:00", orders: 42 },
  { hour: "20:00", orders: 38 },
  { hour: "21:00", orders: 22 },
  { hour: "22:00", orders: 12 },
];

// Activity Log
export const mockActivityLog: ActivityLog[] = [
  {
    id: "act-1",
    userId: "2",
    user: getUserById("2"),
    action: "Order Created",
    details: "New order #1046 for Table 11",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    module: "Orders",
    entityType: "order",
    entityId: "order-5",
  },
  {
    id: "act-2",
    userId: "3",
    user: getUserById("3"),
    action: "Order Ready",
    details: "Order #1044 is ready to serve",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    module: "Kitchen",
    entityType: "order",
    entityId: "order-3",
  },
  {
    id: "act-3",
    userId: "5",
    user: getUserById("5"),
    action: "Order Created",
    details: "New order #1043 for Table 3",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    module: "Orders",
    entityType: "order",
    entityId: "order-2",
  },
  {
    id: "act-4",
    userId: "4",
    user: getUserById("4"),
    action: "Payment Received",
    details: "Table 6 paid $87.50",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    module: "Finance",
    entityType: "payment",
  },
  {
    id: "act-5",
    userId: "2",
    user: getUserById("2"),
    action: "Table Status",
    details: "Table 6 marked for cleaning",
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    module: "Tables",
    entityType: "table",
    entityId: "table-6",
  },
  {
    id: "act-6",
    userId: "1",
    user: getUserById("1"),
    action: "Menu Updated",
    details: "Updated price for Ribeye Steak",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    module: "Menu",
    entityType: "menuItem",
    entityId: "item-4",
  },
  {
    id: "act-7",
    userId: "1",
    user: getUserById("1"),
    action: "User Login",
    details: "Admin logged in from 192.168.1.100",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    module: "Auth",
    ipAddress: "192.168.1.100",
  },
  {
    id: "act-8",
    userId: "1",
    user: getUserById("1"),
    action: "Stock Adjustment",
    details: "Adjusted Ribeye Steak stock (-2 kg)",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    module: "Inventory",
    entityType: "ingredient",
    entityId: "ing-4",
  },
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Order Ready",
    message: "Order #1044 for Table 7 is ready to serve",
    type: "success",
    category: "orders",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "notif-2",
    title: "New Order",
    message: "New order #1043 received for Table 3",
    type: "info",
    category: "orders",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "notif-3",
    title: "Low Stock Alert",
    message: "House Red Wine is running low (3 bottles left)",
    type: "warning",
    category: "inventory",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "notif-4",
    title: "Low Stock Alert",
    message: "Ribeye Steak below minimum stock level",
    type: "warning",
    category: "inventory",
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: "notif-5",
    title: "Daily Report Ready",
    message: "Your daily sales report is ready to view",
    type: "info",
    category: "system",
    read: true,
    archived: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

// API Mock Functions
export const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDashboardStats;
  },

  getAdminDashboardStats: async (): Promise<AdminDashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAdminDashboardStats;
  },

  getRevenueData: async (period?: string): Promise<RevenueData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (period === "monthly") return mockMonthlyRevenueData;
    return mockRevenueData;
  },

  getSalesByCategory: async (): Promise<SalesByCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSalesByCategory;
  },

  getTopSellingItems: async (): Promise<TopSellingItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTopSellingItems;
  },

  getPeakHoursData: async (): Promise<PeakHoursData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPeakHoursData;
  },

  getActivityLog: async (): Promise<ActivityLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockActivityLog;
  },

  // Users
  getUsers: async (): Promise<ManagedUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockManagedUsers;
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockRoles;
  },

  getPermissions: async (): Promise<Permission[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPermissions;
  },

  // Branches
  getBranches: async (): Promise<Branch[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBranches;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders;
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockOrders.find((o) => o.id === id);
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const order = mockOrders.find((o) => o.id === id);
    if (!order) return undefined;
    order.status = status;
    order.updatedAt = new Date();
    if (status === 'served') {
      order.items = order.items.map((item) => ({
        ...item,
        status: item.status === 'ready' ? 'served' : item.status,
      }));
    }
    return order;
  },

  getActiveOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders.filter(
      (o) => !["completed", "cancelled"].includes(o.status),
    );
  },

  getCompletedOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCompletedOrders;
  },

  getKitchenOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders.filter((o) =>
      ["pending", "preparing"].includes(o.status),
    );
  },

  // Tables
  getTables: async (): Promise<Table[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTables;
  },

  getSections: async (): Promise<TableSection[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSections;
  },

  // Reservations
  getReservations: async (): Promise<Reservation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockReservations;
  },

  // Menu
  getMenuCategories: async (): Promise<MenuCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCategories;
  },

  getMenuItems: async (): Promise<MenuItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockMenuItems;
  },

  createOrder: async (
    order: Omit<
      Order,
      "id" | "orderNumber" | "createdAt" | "updatedAt" | "table" | "waiter"
    >,
  ): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextOrderId = `order-${mockOrders.length + mockCompletedOrders.length + 1}`;
    const nextOrderNumber = `#${1046 + mockOrders.length + mockCompletedOrders.length + 1}`;
    const table = mockTables.find((t) => t.id === order.tableId);
    const waiter = getUserById(order.waiterId);

    if (!table) {
      throw new Error("Table not found");
    }

    const newOrder: Order = {
      ...order,
      id: nextOrderId,
      orderNumber: nextOrderNumber,
      table,
      waiter,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrders.push(newOrder);

    const tableIndex = mockTables.findIndex((t) => t.id === order.tableId);
    if (tableIndex > -1) {
      mockTables[tableIndex] = {
        ...mockTables[tableIndex],
        status: "occupied",
        currentOrderId: newOrder.id,
      };
    }

    return newOrder;
  },

  getModifiers: async (): Promise<MenuModifier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockModifiers;
  },

  // Inventory
  getIngredients: async (): Promise<Ingredient[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockIngredients;
  },

  getLowStockIngredients: async (): Promise<Ingredient[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockIngredients.filter((i) => i.currentStock <= i.minimumStock);
  },

  getStockMovements: async (): Promise<StockMovement[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStockMovements;
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockSuppliers;
  },

  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPurchaseOrders;
  },

  // Recipes
  getRecipes: async (): Promise<Recipe[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockRecipes;
  },

  // Finance
  getExpenses: async (): Promise<Expense[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockExpenses;
  },

  // Staff
  getStaff: async (): Promise<StaffMember[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStaff;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockNotifications;
  },
};
