
import React from 'react';
// FIX: Removed imports from react-router-dom as they were causing errors.
import { Page } from '../types';
import { IconDashboard, IconPOS, IconPMS, IconInventory, IconAI } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

// FIX: Replaced Link with <a> and useLocation with a prop-based check for active state.
const NavLink: React.FC<{ to: string; page: Page; icon: React.ReactNode; text: string; onClick: (page: Page) => void; currentPage: Page }> = ({ to, page, icon, text, onClick, currentPage }) => {
  const isActive = currentPage === page;
  
  return (
    <a
      href={`#${to}`}
      onClick={() => onClick(page)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-300 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4">{text}</span>
    </a>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="flex flex-col w-64 bg-base-100 border-r border-base-300">
      <div className="flex items-center justify-center h-20 border-b border-base-300">
        <h1 className="text-2xl font-bold text-white tracking-wider">Aenzbi</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* FIX: Passed currentPage to NavLink to determine active state. */}
        <NavLink to="/dashboard" page={Page.Dashboard} icon={<IconDashboard />} text="Dashboard" onClick={setCurrentPage} currentPage={currentPage} />
        <NavLink to="/pos" page={Page.POS} icon={<IconPOS />} text="Restaurant POS" onClick={setCurrentPage} currentPage={currentPage} />
        <NavLink to="/pms" page={Page.PMS} icon={<IconPMS />} text="Hotel PMS" onClick={setCurrentPage} currentPage={currentPage} />
        <NavLink to="/inventory" page={Page.Inventory} icon={<IconInventory />} text="Inventory" onClick={setCurrentPage} currentPage={currentPage} />
        <NavLink to="/ai-tools" page={Page.AITools} icon={<IconAI />} text="AI Tools" onClick={setCurrentPage} currentPage={currentPage} />
      </nav>
      <div className="px-4 py-4 border-t border-base-300 text-center text-xs text-gray-400">
        <p>&copy; 2024 Aenzbi HotelResto</p>
        <p>Cloud-Powered Hospitality</p>
      </div>
    </div>
  );
};
