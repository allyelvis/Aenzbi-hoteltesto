
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page } from '../types';
import { IconDashboard, IconPOS, IconPMS, IconInventory, IconAI } from '../constants';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string; }> = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname === '/' && to === '/dashboard');
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-300 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4">{text}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-base-100 border-r border-base-300">
      <div className="flex items-center justify-center h-20 border-b border-base-300">
        <h1 className="text-2xl font-bold text-white tracking-wider">Aenzbi</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/dashboard" icon={<IconDashboard />} text="Dashboard" />
        <NavLink to="/pos" icon={<IconPOS />} text="Restaurant POS" />
        <NavLink to="/pms" icon={<IconPMS />} text="Hotel PMS" />
        <NavLink to="/inventory" icon={<IconInventory />} text="Inventory" />
        <NavLink to="/ai-tools" icon={<IconAI />} text="AI Tools" />
      </nav>
      <div className="px-4 py-4 border-t border-base-300 text-center text-xs text-gray-400">
        <p>&copy; 2024 Aenzbi HotelResto</p>
        <p>Cloud-Powered Hospitality</p>
      </div>
    </div>
  );
};
