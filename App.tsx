
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RestaurantPOS } from './components/RestaurantPOS';
import { HotelPMS } from './components/HotelPMS';
import { Inventory } from './components/Inventory';
import { AiTools } from './components/AiTools';
import { Page } from './types';

const getPageTitle = (pathname: string): string => {
    if (pathname.includes(Page.POS)) return 'Restaurant Point of Sale';
    if (pathname.includes(Page.PMS)) return 'Property Management System';
    if (pathname.includes(Page.Inventory)) return 'Inventory Management';
    if (pathname.includes(Page.AITools)) return 'AI-Powered Tools';
    if (pathname.includes(Page.Dashboard)) return 'Dashboard Overview';
    return 'Aenzbi HotelResto';
};

const PageHeader: React.FC = () => {
    const location = useLocation();
    return <Header title={getPageTitle(location.pathname)} />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-base-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pos" element={<RestaurantPOS />} />
              <Route path="/pms" element={<HotelPMS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-tools" element={<AiTools />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
