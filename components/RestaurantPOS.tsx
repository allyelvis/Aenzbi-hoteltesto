
import React, { useState } from 'react';
import { mockMenuItems } from '../services/mockData';
import { MenuItem, OrderItem } from '../types';

const MenuItemCard: React.FC<{ item: MenuItem; onAddToOrder: (item: MenuItem) => void }> = ({ item, onAddToOrder }) => (
    <div 
        className="bg-base-100 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200"
        onClick={() => onAddToOrder(item)}
    >
        <img className="w-full h-32 object-cover" src={item.image} alt={item.name} />
        <div className="p-4">
            <h4 className="font-bold text-lg text-white">{item.name}</h4>
            <p className="text-gray-400 text-sm">{item.category}</p>
            <p className="mt-2 text-primary font-semibold">${item.price.toFixed(2)}</p>
        </div>
    </div>
);

const OrderSummary: React.FC<{ orderItems: OrderItem[]; onUpdateQuantity: (id: number, quantity: number) => void; onClear: () => void }> = ({ orderItems, onUpdateQuantity, onClear }) => {
    const subtotal = orderItems.reduce((acc, current) => acc + current.item.price * current.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <div className="bg-base-100 rounded-lg shadow-lg p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold border-b border-base-300 pb-4 text-white">Current Order</h3>
            <div className="flex-grow overflow-y-auto my-4 pr-2">
                {orderItems.length === 0 ? (
                    <p className="text-gray-400 text-center mt-8">Click an item to add to the order.</p>
                ) : (
                    orderItems.map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-base-300">
                            <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))} className="px-2 py-1 bg-secondary rounded">-</button>
                                <span className="px-3 font-semibold">{quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className="px-2 py-1 bg-secondary rounded">+</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {orderItems.length > 0 && (
                 <div className="border-t border-base-300 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-300"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-white font-bold text-xl"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    <button className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 rounded-lg mt-4 transition-colors">
                        Finalize Payment
                    </button>
                    <button onClick={onClear} className="w-full bg-error hover:bg-red-700 text-white font-bold py-2 rounded-lg mt-2 transition-colors">
                        Clear Order
                    </button>
                </div>
            )}
        </div>
    );
};

export const RestaurantPOS: React.FC = () => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [filter, setFilter] = useState<'All' | 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage'>('All');

    const handleAddToOrder = (item: MenuItem) => {
        setOrderItems(prev => {
            const existing = prev.find(orderItem => orderItem.item.id === item.id);
            if (existing) {
                return prev.map(orderItem =>
                    orderItem.item.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setOrderItems(prev => 
            prev.map(orderItem => orderItem.item.id === id ? { ...orderItem, quantity } : orderItem)
            .filter(orderItem => orderItem.quantity > 0) // Remove if quantity is 0
        );
    };

    const handleClearOrder = () => {
      setOrderItems([]);
    }

    const filteredItems = filter === 'All' ? mockMenuItems : mockMenuItems.filter(item => item.category === filter);
    const categories: ('All' | 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage')[] = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

    return (
        <div className="flex h-[calc(100vh-10rem)] gap-6">
            <div className="w-2/3 flex flex-col">
                <div className="mb-4 flex space-x-2">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <MenuItemCard key={item.id} item={item} onAddToOrder={handleAddToOrder} />
                    ))}
                </div>
            </div>
            <div className="w-1/3">
                <OrderSummary orderItems={orderItems} onUpdateQuantity={handleUpdateQuantity} onClear={handleClearOrder} />
            </div>
        </div>
    );
};
