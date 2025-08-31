
import { Room, RoomStatus, MenuItem, Sale, Supplier, InventoryItem, PurchaseOrder, PurchaseOrderStatus } from '../types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const threeDaysFromNow = new Date(today);
threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

export const mockRooms: Room[] = [
    { id: 1, number: '101', type: 'Standard Queen', status: RoomStatus.Available },
    { id: 2, number: '102', type: 'Standard Queen', status: RoomStatus.Occupied, guest: 'John Doe', checkIn: yesterday.toISOString().split('T')[0], checkOut: tomorrow.toISOString().split('T')[0] },
    { id: 3, number: '103', type: 'Deluxe King', status: RoomStatus.Dirty },
    { id: 4, number: '201', type: 'Suite', status: RoomStatus.Available },
    { id: 5, number: '202', type: 'Standard Queen', status: RoomStatus.Maintenance },
    { id: 6, number: '203', type: 'Deluxe King', status: RoomStatus.Occupied, guest: 'Jane Smith', checkIn: today.toISOString().split('T')[0], checkOut: threeDaysFromNow.toISOString().split('T')[0] },
    { id: 7, number: '301', type: 'Suite', status: RoomStatus.Available },
    { id: 8, number: '302', type: 'Deluxe King', status: RoomStatus.Dirty },
];

export const mockMenuItems: MenuItem[] = [
    { id: 1, name: 'Truffle Fries', category: 'Appetizer', price: 12.50, image: 'https://picsum.photos/id/10/300/200', description: 'Crispy fries tossed in truffle oil and parmesan.' },
    { id: 2, name: 'Bruschetta', category: 'Appetizer', price: 10.00, image: 'https://picsum.photos/id/20/300/200', description: 'Toasted bread with tomatoes, garlic, and basil.' },
    { id: 3, name: 'Ribeye Steak', category: 'Main Course', price: 35.00, image: 'https://picsum.photos/id/30/300/200', description: '12oz prime ribeye, cooked to perfection.' },
    { id: 4, name: 'Salmon Fillet', category: 'Main Course', price: 28.00, image: 'https://picsum.photos/id/40/300/200', description: 'Grilled salmon with a lemon-dill sauce.' },
    { id: 5, name: 'Cheesecake', category: 'Dessert', price: 9.00, image: 'https://picsum.photos/id/50/300/200', description: 'Classic New York style cheesecake.' },
    { id: 6, name: 'Lava Cake', category: 'Dessert', price: 11.00, image: 'https://picsum.photos/id/60/300/200', description: 'Warm chocolate cake with a molten center.' },
    { id: 7, name: 'Old Fashioned', category: 'Beverage', price: 15.00, image: 'https://picsum.photos/id/70/300/200', description: 'Whiskey, bitters, sugar, and a twist of citrus.' },
    { id: 8, name: 'Espresso', category: 'Beverage', price: 4.00, image: 'https://picsum.photos/id/80/300/200', description: 'Rich and aromatic single shot espresso.' },
];

export const mockSales: Sale[] = [
    { id: 'S001', date: '2023-10-27T10:00:00Z', items: [{ name: 'Ribeye Steak', category: 'Main Course', quantity: 2, price: 35.00 }, { name: 'Old Fashioned', category: 'Beverage', quantity: 2, price: 15.00 }], total: 100.00 },
    { id: 'S002', date: '2023-10-27T12:30:00Z', items: [{ name: 'Salmon Fillet', category: 'Main Course', quantity: 1, price: 28.00 }, { name: 'Truffle Fries', category: 'Appetizer', quantity: 1, price: 12.50 }], total: 40.50 },
    { id: 'S003', date: '2023-10-28T19:00:00Z', items: [{ name: 'Cheesecake', category: 'Dessert', quantity: 2, price: 9.00 }, { name: 'Espresso', category: 'Beverage', quantity: 2, price: 4.00 }], total: 26.00 },
    { id: 'S004', date: '2023-10-29T20:15:00Z', items: [{ name: 'Ribeye Steak', category: 'Main Course', quantity: 1, price: 35.00 }], total: 35.00 },
];

// New Mock Data for Inventory Management

export const mockSuppliers: Supplier[] = [
    { id: 1, name: 'Fresh Produce Co.', contactPerson: 'Mark Green', email: 'mark@freshproduce.com', phone: '555-0101' },
    { id: 2, name: 'Prime Meats Ltd.', contactPerson: 'Susan Beef', email: 'susan@primemeats.com', phone: '555-0102' },
    { id: 3, name: 'Beverage World', contactPerson: 'Chris Waters', email: 'chris@bevworld.com', phone: '555-0103' },
];

export const mockInventoryItems: InventoryItem[] = [
    { id: 101, name: 'Potatoes', category: 'Vegetable', quantityInStock: 50, unit: 'kg', reorderLevel: 20, supplierId: 1 },
    { id: 102, name: 'Tomatoes', category: 'Vegetable', quantityInStock: 30, unit: 'kg', reorderLevel: 15, supplierId: 1 },
    { id: 201, name: 'Ribeye Steak', category: 'Meat', quantityInStock: 25, unit: 'units', reorderLevel: 10, supplierId: 2 },
    { id: 202, name: 'Salmon Fillet', category: 'Fish', quantityInStock: 20, unit: 'units', reorderLevel: 10, supplierId: 2 },
    { id: 301, name: 'Whiskey', category: 'Spirits', quantityInStock: 15, unit: 'liters', reorderLevel: 5, supplierId: 3 },
    { id: 302, name: 'Coffee Beans', category: 'Beverage', quantityInStock: 40, unit: 'kg', reorderLevel: 10, supplierId: 3 },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
    { 
        id: 'PO-001', 
        supplierId: 1, 
        orderDate: '2023-11-01T10:00:00Z', 
        expectedDeliveryDate: '2023-11-03T10:00:00Z', 
        items: [{ itemId: 101, quantity: 30, unitPrice: 2.5 }, { itemId: 102, quantity: 20, unitPrice: 3 }],
        status: PurchaseOrderStatus.Completed,
        totalCost: 135
    },
    { 
        id: 'PO-002', 
        supplierId: 2, 
        orderDate: '2023-11-05T14:00:00Z', 
        expectedDeliveryDate: '2023-11-07T14:00:00Z', 
        items: [{ itemId: 201, quantity: 15, unitPrice: 20 }],
        status: PurchaseOrderStatus.Pending,
        totalCost: 300
    },
];
