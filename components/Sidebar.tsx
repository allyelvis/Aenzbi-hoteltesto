
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Page } from '../types';
import { IconDashboard, IconPOS, IconPMS, IconAI } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{ to: string; page: Page; icon: React.ReactNode; text: string; onClick: (page: Page) => void }> = ({ to, page, icon, text, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(page);
  
  return (
    <Link
      to={to}
      onClick={() => onClick(page)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-300 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4">{text}</span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="flex flex-col w-64 bg-base-100 border-r border-base-300">
      <div className="flex items-center justify-center h-20 border-b border-base-300">
        <h1 className="text-2xl font-bold text-white tracking-wider">Aenzbi</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/dashboard" page={Page.Dashboard} icon={<IconDashboard />} text="Dashboard" onClick={setCurrentPage} />
        <NavLink to="/pos" page={Page.POS} icon={<IconPOS />} text="Restaurant POS" onClick={setCurrentPage} />
        <NavLink to="/pms" page={Page.PMS} icon={<IconPMS />} text="Hotel PMS" onClick={setCurrentPage} />
        <NavLink to="/ai-tools" page={Page.AITools} icon={<IconAI />} text="AI Tools" onClick={setCurrentPage} />
      </nav>
      <div className="px-4 py-4 border-t border-base-300 text-center text-xs text-gray-400">
        <p>&copy; 2024 Aenzbi HotelResto</p>
        <p>Cloud-Powered Hospitality</p>
      </div>
    </div>
  );
};
