
import React, { useState } from 'react';
import { mockInventoryItems, mockSuppliers, mockPurchaseOrders } from '../services/mockData';
import { InventoryItem, Supplier, PurchaseOrder, PurchaseOrderStatus } from '../types';

type Tab = 'inventory' | 'suppliers' | 'purchase_orders';

// Reusable components for this view
const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none ${
            active ? 'bg-base-100 text-primary border-b-2 border-primary' : 'text-gray-400 hover:bg-base-300'
        }`}
    >
        {children}
    </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-base-100 p-6 rounded-lg shadow-lg ${className}`}>
        {children}
    </div>
);

// Main Content Components for each tab
const InventoryList: React.FC<{ items: InventoryItem[], suppliers: Supplier[] }> = ({ items, suppliers }) => {
    const getSupplierName = (id: number) => suppliers.find(s => s.id === id)?.name || 'Unknown';
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Inventory Items</h2>
                <button className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg">Add New Item</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-base-200">
                        <tr>
                            <th className="px-4 py-3">Item Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">In Stock</th>
                            <th className="px-4 py-3">Reorder Level</th>
                            <th className="px-4 py-3">Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-b border-base-300 hover:bg-base-200">
                                <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                                <td className="px-4 py-3 text-gray-300">{item.category}</td>
                                <td className={`px-4 py-3 font-semibold ${item.quantityInStock <= item.reorderLevel ? 'text-error' : 'text-gray-300'}`}>
                                    {item.quantityInStock} {item.unit}
                                </td>
                                <td className="px-4 py-3 text-gray-300">{item.reorderLevel} {item.unit}</td>
                                <td className="px-4 py-3 text-gray-300">{getSupplierName(item.supplierId)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const SupplierList: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Suppliers</h2>
            <button className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg">Add New Supplier</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-base-200">
                    <tr>
                        <th className="px-4 py-3">Supplier Name</th>
                        <th className="px-4 py-3">Contact Person</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={supplier.id} className="border-b border-base-300 hover:bg-base-200">
                            <td className="px-4 py-3 font-medium text-white">{supplier.name}</td>
                            <td className="px-4 py-3 text-gray-300">{supplier.contactPerson}</td>
                            <td className="px-4 py-3 text-gray-300">{supplier.email}</td>
                            <td className="px-4 py-3 text-gray-300">{supplier.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const PurchaseOrderList: React.FC<{ orders: PurchaseOrder[], suppliers: Supplier[], items: InventoryItem[] }> = ({ orders, suppliers, items }) => {
    const getSupplierName = (id: number) => suppliers.find(s => s.id === id)?.name || 'Unknown';

    const getStatusChip = (status: PurchaseOrderStatus) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
        switch(status) {
            case PurchaseOrderStatus.Completed: return `${baseClasses} bg-success/20 text-success`;
            case PurchaseOrderStatus.Pending: return `${baseClasses} bg-warning/20 text-warning`;
            case PurchaseOrderStatus.Cancelled: return `${baseClasses} bg-error/20 text-error`;
            default: return `${baseClasses} bg-neutral/20 text-neutral-content`;
        }
    }
    
    return (
         <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Purchase Orders</h2>
                <button className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg">Create New PO</button>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-base-200">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Supplier</th>
                            <th className="px-4 py-3">Order Date</th>
                            <th className="px-4 py-3">Total Cost</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-base-300 hover:bg-base-200">
                                <td className="px-4 py-3 font-medium text-white">{order.id}</td>
                                <td className="px-4 py-3 text-gray-300">{getSupplierName(order.supplierId)}</td>
                                <td className="px-4 py-3 text-gray-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-gray-300">${order.totalCost.toFixed(2)}</td>
                                <td className="px-4 py-3"><span className={getStatusChip(order.status)}>{order.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


export const Inventory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('inventory');
    
    // In a real app, this state would be managed via props, context, or a state management library
    const [inventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [suppliers] = useState<Supplier[]>(mockSuppliers);
    const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return <InventoryList items={inventoryItems} suppliers={suppliers} />;
            case 'suppliers':
                return <SupplierList suppliers={suppliers} />;
            case 'purchase_orders':
                return <PurchaseOrderList orders={purchaseOrders} suppliers={suppliers} items={inventoryItems} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex border-b border-base-300">
                <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton>
                <TabButton active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')}>Suppliers</TabButton>
                <TabButton active={activeTab === 'purchase_orders'} onClick={() => setActiveTab('purchase_orders')}>Purchase Orders</TabButton>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};
