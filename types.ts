
export enum Page {
    Dashboard = 'dashboard',
    POS = 'pos',
    PMS = 'pms',
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