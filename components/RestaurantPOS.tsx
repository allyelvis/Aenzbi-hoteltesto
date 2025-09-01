import React, { useState, useEffect } from 'react';
import { mockMenuItems, mockTables, mockOrders, mockTaxes } from '../services/mockData';
import { MenuItem, OrderItem, Table, TableStatus, Order, Tax } from '../types';
import { generateMenuItemDescription } from '../services/geminiService';

// Toast Notification Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-8 bg-success text-white py-2 px-5 rounded-lg shadow-lg z-50 animate-fade-in-out">
            {message}
        </div>
    );
};


// A unified modal for both adding and editing a menu item
const MenuItemModal: React.FC<{
    item: MenuItem | null; // null for adding a new item
    onClose: () => void;
    onSave: (item: MenuItem) => void;
    onDelete: (id: number) => void;
}> = ({ item, onClose, onSave, onDelete }) => {
    const [name, setName] = useState(item?.name || '');
    const [price, setPrice] = useState(item?.price || 0);
    const [category, setCategory] = useState(item?.category || 'Appetizer');
    const [description, setDescription] = useState(item?.description || '');
    const [image, setImage] = useState(item?.image || 'https://picsum.photos/id/102/300/200');
    const [isGenerating, setIsGenerating] = useState(false);
    const isNewItem = item === null;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateDescription = async () => {
        if (!name.trim()) {
            alert("Please enter an item name before generating a description.");
            return;
        }
        setIsGenerating(true);
        const desc = await generateMenuItemDescription(name, category);
        setDescription(desc);
        setIsGenerating(false);
    };

    const handleSave = () => {
        const savedItem: MenuItem = {
            id: item?.id || Date.now(), // Create a new ID for new items
            name,
            price: Number(price),
            category,
            description,
            image,
        };
        onSave(savedItem);
    };
    
    const handleDelete = () => {
        if (item && window.confirm(`Are you sure you want to delete ${item.name}?`)) {
            onDelete(item.id);
        }
    }

    const categories: ('Appetizer' | 'Main Course' | 'Dessert' | 'Beverage')[] = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white" id="modal-title">{isNewItem ? 'Add New Menu Item' : 'Edit Menu Item'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="flex items-center gap-4">
                        <img src={image} alt={name} className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                            <label htmlFor="image-upload" className="text-sm text-gray-400 block mb-2">Upload new image</label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-focus file:text-primary-content
                                    hover:file:bg-primary cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="item-name" className="text-sm text-gray-400 block mb-1">Item Name</label>
                        <input id="item-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                             <label htmlFor="item-price" className="text-sm text-gray-400 block mb-1">Price</label>
                             <input id="item-price" type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary" />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="item-category" className="text-sm text-gray-400 block mb-1">Category</label>
                             <select id="item-category" value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                         <div className="flex justify-between items-center mb-1">
                            <label htmlFor="item-description" className="text-sm text-gray-400">Description</label>
                            <button onClick={handleGenerateDescription} disabled={isGenerating} className="text-sm bg-accent hover:bg-accent-focus text-white font-semibold py-1 px-3 rounded-full disabled:bg-gray-600">
                                {isGenerating ? 'Generating...' : '✨ Generate with AI'}
                            </button>
                        </div>
                        <textarea id="item-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-base-300 text-white p-2 rounded-lg border border-secondary"></textarea>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-base-300 mt-6">
                    <div>
                        {!isNewItem && (
                            <button onClick={handleDelete} className="bg-error hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="bg-secondary hover:bg-secondary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// New Tax Management Modal
const TaxManagementModal: React.FC<{
    initialTaxes: Tax[];
    onClose: () => void;
    onSave: (taxes: Tax[]) => void;
}> = ({ initialTaxes, onClose, onSave }) => {
    const [localTaxes, setLocalTaxes] = useState<Tax[]>(() => JSON.parse(JSON.stringify(initialTaxes)));

    const handleTaxChange = (id: number, field: keyof Tax, value: string | number | boolean) => {
        setLocalTaxes(current =>
            current.map(tax => (tax.id === id ? { ...tax, [field]: value } : tax))
        );
    };

    const handleAddNew = () => {
        const newTax: Tax = {
            id: Date.now(),
            name: 'New Tax',
            type: 'percentage',
            value: 0,
            enabled: true,
        };
        setLocalTaxes(current => [...current, newTax]);
    };

    const handleDelete = (id: number) => {
        setLocalTaxes(current => current.filter(tax => tax.id !== id));
    };

    const handleSave = () => {
        onSave(localTaxes);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="tax-modal-title">
            <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white" id="tax-modal-title">Tax Configuration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-4 mb-4">
                    <div className="grid grid-cols-12 gap-x-4 text-xs text-gray-400 font-bold uppercase px-2">
                        <div className="col-span-1">On</div>
                        <div className="col-span-5">Tax Name</div>
                        <div className="col-span-3">Value</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-1"></div>
                    </div>
                    {localTaxes.map(tax => (
                        <div key={tax.id} className="grid grid-cols-12 gap-x-4 items-center bg-base-300 p-2 rounded-lg">
                            <div className="col-span-1 flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={tax.enabled}
                                    onChange={e => handleTaxChange(tax.id, 'enabled', e.target.checked)}
                                    className="toggle toggle-primary"
                                />
                            </div>
                            <div className="col-span-5">
                                <input type="text" value={tax.name} onChange={e => handleTaxChange(tax.id, 'name', e.target.value)} className="w-full bg-base-100 text-white p-2 rounded-md border border-secondary" />
                            </div>
                            <div className="col-span-3">
                                <input type="number" step="0.01" value={tax.value} onChange={e => handleTaxChange(tax.id, 'value', parseFloat(e.target.value) || 0)} className="w-full bg-base-100 text-white p-2 rounded-md border border-secondary" />
                            </div>
                            <div className="col-span-2">
                                <select value={tax.type} onChange={e => handleTaxChange(tax.id, 'type', e.target.value)} className="w-full bg-base-100 text-white p-2 rounded-md border border-secondary">
                                    <option value="percentage">%</option>
                                    <option value="fixed">$</option>
                                </select>
                            </div>
                            <div className="col-span-1 text-center">
                                <button onClick={() => handleDelete(tax.id)} className="text-gray-500 hover:text-error transition-colors" aria-label={`Delete ${tax.name}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleAddNew} className="text-sm bg-secondary hover:bg-secondary-focus text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add New Tax
                </button>

                <div className="flex justify-end gap-4 pt-6 border-t border-base-300 mt-6">
                    <button onClick={onClose} className="bg-secondary hover:bg-secondary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors">Save Taxes</button>
                </div>
            </div>
        </div>
    );
};


const MenuItemCard: React.FC<{ 
    item: MenuItem; 
    onAddToOrder: (item: MenuItem) => void;
    onEdit: (item: MenuItem) => void; 
}> = ({ item, onAddToOrder, onEdit }) => (
    <div 
        className="bg-base-100 rounded-lg overflow-hidden shadow-lg group relative transform hover:scale-105 transition-transform duration-200"
    >
        <div 
            className="cursor-pointer"
            onClick={() => onAddToOrder(item)}
        >
            <img className="w-full h-32 object-cover" src={item.image} alt={item.name} />
            <div className="p-4">
                <h4 className="font-bold text-lg text-white">{item.name}</h4>
                <p className="text-gray-400 text-sm">{item.category}</p>
                <p className="mt-2 text-primary font-semibold">${item.price.toFixed(2)}</p>
            </div>
        </div>
        <button 
            onClick={() => onEdit(item)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            aria-label={`Edit ${item.name}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
);

const OrderSummary: React.FC<{ 
    selectedTable: Table | null;
    order: Order | null;
    activeTaxes: Tax[];
    onUpdateQuantity: (itemId: number, quantity: number) => void; 
    onRemoveItem: (itemId: number) => void; 
    onFinalizePayment: () => void;
    onOpenTaxModal: () => void;
}> = ({ selectedTable, order, activeTaxes, onUpdateQuantity, onRemoveItem, onFinalizePayment, onOpenTaxModal }) => {
    const subtotal = order?.items.reduce((acc, current) => acc + current.item.price * current.quantity, 0) || 0;
    
    const appliedTaxes = activeTaxes.map(tax => {
        const amount = tax.type === 'percentage' ? subtotal * (tax.value / 100) : tax.value;
        return { ...tax, amount };
    });

    const totalTax = appliedTaxes.reduce((acc, tax) => acc + tax.amount, 0);
    const total = subtotal + totalTax;


    return (
        <div className="bg-base-100 rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-base-300 pb-4">
                 <h3 className="text-2xl font-bold text-white">
                    {selectedTable ? `Table ${selectedTable.name} Order` : 'Select a Table'}
                </h3>
                <button onClick={onOpenTaxModal} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-base-300 transition-colors" aria-label="Tax Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto my-4 pr-2">
                {!order || order.items.length === 0 ? (
                    <p className="text-gray-400 text-center mt-8">
                        {selectedTable ? 'Add items from the menu.' : 'Select a table from the floor plan to start an order.'}
                    </p>
                ) : (
                    order.items.map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-base-300 group">
                            <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))} className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-lg">-</button>
                                <span className="px-3 font-semibold min-w-[2rem] text-center">{quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-lg">+</button>
                                <button onClick={() => onRemoveItem(item.id)} className="ml-1 text-gray-500 hover:text-error transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove item">
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {order && order.items.length > 0 && (
                 <div className="border-t border-base-300 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    
                    {appliedTaxes.map(tax => (
                        <div key={tax.id} className="flex justify-between text-gray-300 text-sm">
                            <span>{tax.name} {tax.type === 'percentage' && `(${tax.value}%)`}</span>
                            <span>+ ${tax.amount.toFixed(2)}</span>
                        </div>
                    ))}
                    
                    <div className="flex justify-between text-white font-bold text-xl pt-2 mt-2 border-t border-white/10"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    <button onClick={onFinalizePayment} className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 rounded-lg mt-4 transition-colors">
                        Finalize Payment
                    </button>
                </div>
            )}
        </div>
    );
};

const getTableStatusColor = (status: TableStatus): string => {
    switch(status) {
        case TableStatus.Available: return "bg-green-500/20 border-2 border-green-500 text-green-300 hover:bg-green-500/40";
        case TableStatus.Occupied: return "bg-blue-500/20 border-2 border-blue-500 text-blue-300 hover:bg-blue-500/40";
        case TableStatus.Reserved: return "bg-yellow-500/20 border-2 border-yellow-500 text-yellow-300 hover:bg-yellow-500/40";
        default: return "bg-gray-500/20 border-2 border-gray-500 text-gray-300";
    }
}

const FloorPlanView: React.FC<{ tables: Table[], onSelectTable: (tableId: number) => void, selectedTableId: number | null }> = ({ tables, onSelectTable, selectedTableId }) => (
    <div className="bg-base-200 p-4 rounded-lg h-full relative">
        {tables.map(table => (
            <div
                key={table.id}
                onClick={() => onSelectTable(table.id)}
                style={{ left: `${table.x}%`, top: `${table.y}%`, width: table.shape === 'square' ? '12%' : '10%', paddingBottom: table.shape === 'square' ? '12%' : '10%' }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${table.shape === 'circle' ? 'rounded-full' : 'rounded-lg'} ${getTableStatusColor(table.status)} ${selectedTableId === table.id ? 'ring-4 ring-primary ring-offset-2 ring-offset-base-200' : ''}`}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-bold text-lg">{table.name}</span>
                    <span className="text-xs">({table.capacity} seats)</span>
                </div>
            </div>
        ))}
    </div>
);

const MenuView: React.FC<{ 
    menuItems: MenuItem[], 
    onAddToOrder: (item: MenuItem) => void, 
    onOpenModal: (item: MenuItem | null) => void 
}> = ({ menuItems, onAddToOrder, onOpenModal }) => {
    const [filter, setFilter] = useState<'All' | 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredItems = menuItems
        .filter(item => filter === 'All' || item.category === filter)
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
    const categories: ('All' | 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage')[] = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 flex flex-wrap gap-2 items-center">
                <div className="relative flex-grow">
                     <input 
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-base-100 p-2 rounded-lg border border-secondary pl-10"
                    />
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <button onClick={() => onOpenModal(null)} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    New Item
                </button>
            </div>
            <div className="mb-4 flex space-x-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${filter === cat ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        onAddToOrder={onAddToOrder} 
                        onEdit={() => onOpenModal(item)}
                    />
                ))}
            </div>
        </div>
    );
};

export const RestaurantPOS: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
    const [tables, setTables] = useState<Table[]>(mockTables);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [taxes, setTaxes] = useState<Tax[]>(mockTaxes);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<'floorplan' | 'menu'>('floorplan');
    const [menuModalState, setMenuModalState] = useState<{isOpen: boolean; item: MenuItem | null}>({isOpen: false, item: null});
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const selectedTable = tables.find(t => t.id === selectedTableId) || null;
    const currentOrder = orders.find(o => o.tableId === selectedTableId && o.status === 'Open') || null;

    const handleSelectTable = (tableId: number) => {
        setSelectedTableId(tableId);
        const table = tables.find(t => t.id === tableId);
        if (table?.status === TableStatus.Available) {
            const newOrder: Order = { id: `ORD-${Date.now()}`, tableId, items: [], status: 'Open' };
            setOrders(prev => [...prev, newOrder]);
            setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.Occupied } : t));
        }
        setActiveView('menu');
    };

    const handleAddToOrder = (item: MenuItem) => {
        if (!selectedTableId || !currentOrder) {
            setToastMessage("Please select a table first!");
            setActiveView('floorplan');
            return;
        }
        setOrders(prev => prev.map(order => {
            if (order.id !== currentOrder.id) return order;
            const existing = order.items.find(i => i.item.id === item.id);
            if (existing) {
                return { ...order, items: order.items.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
            }
            return { ...order, items: [...order.items, { item, quantity: 1 }] };
        }));
        setToastMessage(`${item.name} added to order`);
    };

    const handleUpdateQuantity = (itemId: number, quantity: number) => {
        if (!currentOrder) return;
        setOrders(prev => prev.map(o => o.id === currentOrder.id 
            ? { ...o, items: o.items.map(i => i.item.id === itemId ? { ...i, quantity } : i).filter(i => i.quantity > 0) } 
            : o
        ));
    };

    const handleRemoveItem = (itemId: number) => {
        handleUpdateQuantity(itemId, 0);
    };

    const handleFinalizePayment = () => {
        if (!selectedTableId || !currentOrder) return;
        setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, status: 'Paid' } : o));
        setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: TableStatus.Available } : t));
        setToastMessage(`Payment for Table ${selectedTable?.name} finalized.`);
        setSelectedTableId(null);
        setActiveView('floorplan');
    };
    
    const handleOpenMenuModal = (item: MenuItem | null) => setMenuModalState({ isOpen: true, item });
    const handleCloseMenuModal = () => setMenuModalState({ isOpen: false, item: null });

    const handleSaveItem = (savedItem: MenuItem) => {
        setMenuItems(prevItems => {
            const exists = prevItems.some(item => item.id === savedItem.id);
            return exists ? prevItems.map(item => (item.id === savedItem.id ? savedItem : item)) : [...prevItems, savedItem];
        });
        handleCloseMenuModal();
    };
    
    const handleDeleteItem = (id: number) => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        handleCloseMenuModal();
    };

    const handleSaveTaxes = (updatedTaxes: Tax[]) => {
        setTaxes(updatedTaxes);
        setIsTaxModalOpen(false);
        setToastMessage("Tax settings updated.");
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
            <div className="flex h-[calc(100vh-10rem)] gap-6">
                <div className="w-2/3 flex flex-col">
                    <div className="flex border-b border-base-300 mb-4">
                        <button onClick={() => setActiveView('floorplan')} className={`px-4 py-2 font-semibold transition-colors ${activeView === 'floorplan' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Floor Plan</button>
                        <button onClick={() => setActiveView('menu')} className={`px-4 py-2 font-semibold transition-colors ${activeView === 'menu' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>Menu Items</button>
                    </div>
                    <div className="flex-grow">
                        {activeView === 'floorplan' ? (
                            <FloorPlanView tables={tables} onSelectTable={handleSelectTable} selectedTableId={selectedTableId} />
                        ) : (
                            <MenuView menuItems={menuItems} onAddToOrder={handleAddToOrder} onOpenModal={handleOpenMenuModal} />
                        )}
                    </div>
                </div>
                <div className="w-1/3">
                    <OrderSummary 
                        selectedTable={selectedTable} 
                        order={currentOrder}
                        activeTaxes={taxes.filter(t => t.enabled)}
                        onUpdateQuantity={handleUpdateQuantity} 
                        onRemoveItem={handleRemoveItem} 
                        onFinalizePayment={handleFinalizePayment}
                        onOpenTaxModal={() => setIsTaxModalOpen(true)}
                    />
                </div>
            </div>
            {menuModalState.isOpen && (
                <MenuItemModal
                    item={menuModalState.item}
                    onClose={handleCloseMenuModal}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                />
            )}
             {isTaxModalOpen && (
                <TaxManagementModal
                    initialTaxes={taxes}
                    onClose={() => setIsTaxModalOpen(false)}
                    onSave={handleSaveTaxes}
                />
            )}
        </>
    );
};
