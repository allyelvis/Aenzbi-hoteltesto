export enum Page {
    Dashboard = 'dashboard',
    POS = 'pos',
    PMS = 'pms',
    Inventory = 'inventory',
    AITools = 'ai-tools'
}

export enum RoomStatus {
    Available = 'Available',
    Occupied = 'Occupied',
    Dirty = 'Dirty',
    Maintenance = 'Maintenance',
}

export interface Room {
    id: number;
    number: string;
    type: string;
    status: RoomStatus;
    guest?: string;
    checkIn?: string;
    checkOut?: string;
}

export interface MenuItem {
    id: number;
    name: string;
    category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';
    price: number;
    description?: string;
    image: string;
}

export interface OrderItem {
    item: MenuItem;
    quantity: number;
}

export interface Sale {
    id: string;
    date: string; // ISO format
    items: { name: string; category: string; quantity: number; price: number }[];
    total: number;
}

// New Interfaces for Restaurant Table Management
export enum TableStatus {
    Available = 'Available',
    Occupied = 'Occupied',
    Reserved = 'Reserved',
}

export interface Table {
    id: number;
    name: string;
    capacity: number;
    status: TableStatus;
    x: number; // position percentage from left
    y: number; // position percentage from top
    shape: 'square' | 'circle';
}

export interface Order {
    id: string; // e.g., ORD-001
    tableId: number;
    items: OrderItem[];
    status: 'Open' | 'Paid' | 'Cancelled';
}


// New Interfaces for Inventory Management
export interface Supplier {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}

export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    quantityInStock: number;
    unit: 'kg' | 'liters' | 'units';
    reorderLevel: number;
    supplierId: number; // Link to a supplier
}

export enum PurchaseOrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export interface PurchaseOrderItem {
    itemId: number;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrder {
    id: string; // e.g., PO-001
    supplierId: number;
    orderDate: string; // ISO format
    expectedDeliveryDate: string; // ISO format
    items: PurchaseOrderItem[];
    status: PurchaseOrderStatus;
    totalCost: number;
}

// New Interface for Tax Management
export interface Tax {
  id: number;
  name: string;
  type: 'percentage' | 'fixed';
  value: number; // The percentage rate (e.g., 8 for 8%) or the fixed amount
  enabled: boolean;
}
