
export enum Page {
    Dashboard = 'dashboard',
    POS = 'pos',
    PMS = 'pms',
    Inventory = 'inventory',
    AITools = 'ai-tools'
}

// --- HOTEL PMS TYPES ---
export enum RoomStatus {
    Available = 'Available',
    Occupied = 'Occupied',
    Dirty = 'Dirty',
    Maintenance = 'Maintenance',
}

export enum HousekeepingStatus {
    Clean = 'Clean',
    Dirty = 'Dirty',
    InProgress = 'In Progress',
    Inspect = 'Inspect',
}

export interface Room {
    id: number;
    number: string;
    type: string; // e.g., 'Standard Queen', 'Deluxe King', 'Suite'
    status: RoomStatus; // Overall status (dynamic)
    housekeepingStatus: HousekeepingStatus;
    rate: number; // Price per night
}

export interface Guest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

export enum BookingStatus {
    Confirmed = 'Confirmed',
    CheckedIn = 'Checked-In',
    CheckedOut = 'Checked-Out',
    Cancelled = 'Cancelled',
}

export enum PaymentStatus {
    Paid = 'Paid',
    Unpaid = 'Unpaid',
    Partial = 'Partial',
}

export interface Booking {
    id: string; // e.g., BOOK-12345
    guestId: number;
    roomId: number;
    checkIn: string; // ISO Date string
    checkOut: string; // ISO Date string
    status: BookingStatus;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    notes?: string;
}

// --- RESTAURANT POS TYPES ---
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
    status: 'Open' | 'Processing Payment' | 'Paid' | 'Cancelled';
}

export interface Tax {
  id: number;
  name: string;
  type: 'percentage' | 'fixed';
  value: number; // The percentage rate (e.g., 8 for 8%) or the fixed amount
  enabled: boolean;
}

export enum PaymentMethod {
    Cash = 'Cash',
    CreditCard = 'Credit Card',
    MobilePayment = 'Mobile Payment',
}

export interface Transaction {
    id: string;
    orderId: string;
    amount: number;
    method: PaymentMethod;
    status: 'Completed' | 'Failed';
    date: string; // ISO format
    gatewayResponse?: string;
}

// --- INVENTORY TYPES ---
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
    unit: string;
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
