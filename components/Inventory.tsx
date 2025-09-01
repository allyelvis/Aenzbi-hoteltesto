
import React, { useState, useEffect } from 'react';
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

// Supplier Detail Modal Component
const SupplierDetailModal: React.FC<{
    supplier: Supplier;
    items: InventoryItem[];
    onClose: () => void;
    onSave: (supplier: Supplier) => void;
}> = ({ supplier, items, onClose, onSave }) => {
    const [editedSupplier, setEditedSupplier] = useState<Supplier>(supplier);

    useEffect(() => {
        setEditedSupplier(supplier);
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedSupplier(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedSupplier);
    };

    const suppliedItems = items.filter(item => item.supplierId === supplier.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white" id="modal-title">Supplier Details: {supplier.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-h-[70vh] overflow-y-auto pr-4">
                    {/* Left side: Editable form */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-base-300 pb-2">Contact Information</h3>
                        <div>
                            <label htmlFor="supplier-name" className="text-sm text-gray-400 block mb-1">Supplier Name</label>
                            <input id="supplier-name" name="name" type="text" value={editedSupplier.name} onChange={handleChange} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                        </div>
                        <div>
                            <label htmlFor="supplier-contact" className="text-sm text-gray-400 block mb-1">Contact Person</label>
                            <input id="supplier-contact" name="contactPerson" type="text" value={editedSupplier.contactPerson} onChange={handleChange} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                        </div>
                        <div>
                            <label htmlFor="supplier-email" className="text-sm text-gray-400 block mb-1">Email</label>
                            <input id="supplier-email" name="email" type="email" value={editedSupplier.email} onChange={handleChange} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                        </div>
                        <div>
                            <label htmlFor="supplier-phone" className="text-sm text-gray-400 block mb-1">Phone</label>
                            <input id="supplier-phone" name="phone" type="tel" value={editedSupplier.phone} onChange={handleChange} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                        </div>
                    </div>

                    {/* Right side: Supplied items list */}
                    <div>
                        <h3 className="text-lg font-semibold text-white border-b border-base-300 pb-2">Items Supplied</h3>
                        <div className="bg-base-300 rounded-lg p-3 mt-4 h-60 overflow-y-auto">
                            {suppliedItems.length > 0 ? (
                                <ul className="space-y-2">
                                    {suppliedItems.map(item => (
                                        <li key={item.id} className="text-gray-300 text-sm p-2 rounded bg-base-100 flex justify-between">
                                            <span>{item.name}</span>
                                            <span className="text-gray-500">{item.category}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-400 text-sm text-center">No items from this supplier in inventory.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-base-300 mt-6">
                    <button onClick={onClose} className="bg-secondary hover:bg-secondary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};


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

const SupplierList: React.FC<{ suppliers: Supplier[], onSelectSupplier: (supplier: Supplier) => void }> = ({ suppliers, onSelectSupplier }) => (
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
                        <tr key={supplier.id} onClick={() => onSelectSupplier(supplier)} className="border-b border-base-300 hover:bg-base-200 cursor-pointer">
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
    const [inventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
    const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const handleSupplierSelect = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
    };

    const handleCloseModal = () => {
        setSelectedSupplier(null);
    };

    const handleSaveSupplier = (updatedSupplier: Supplier) => {
        setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
        handleCloseModal();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return <InventoryList items={inventoryItems} suppliers={suppliers} />;
            case 'suppliers':
                return <SupplierList suppliers={suppliers} onSelectSupplier={handleSupplierSelect} />;
            case 'purchase_orders':
                return <PurchaseOrderList orders={purchaseOrders} suppliers={suppliers} items={inventoryItems} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex border-b border-base-300">
                    <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</TabButton>
                    <TabButton active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')}>Suppliers</TabButton>
                    {/* FIX: Replaced incorrect `Button` component with `TabButton` to resolve reference error. */}
                    <TabButton active={activeTab === 'purchase_orders'} onClick={() => setActiveTab('purchase_orders')}>Purchase Orders</TabButton>
                </div>
                <div>
                    {renderContent()}
                </div>
            </div>
            {selectedSupplier && (
                <SupplierDetailModal 
                    supplier={selectedSupplier}
                    items={inventoryItems}
                    onClose={handleCloseModal}
                    onSave={handleSaveSupplier}
                />
            )}
        </>
    );
};
