
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RestaurantPOS } from './components/RestaurantPOS';
import { HotelPMS } from './components/HotelPMS';
import { AiTools } from './components/AiTools';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const getPageTitle = (page: Page): string => {
    switch (page) {
      case Page.Dashboard:
        return 'Dashboard Overview';
      case Page.POS:
        return 'Restaurant Point of Sale';
      case Page.PMS:
        return 'Property Management System';
      case Page.AITools:
        return 'AI-Powered Tools';
      default:
        return 'Aenzbi HotelResto';
    }
  };

  return (
    <HashRouter>
      <div className="flex h-screen bg-base-100 font-sans">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getPageTitle(currentPage)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pos" element={<RestaurantPOS />} />
              <Route path="/pms" element={<HotelPMS />} />
              <Route path="/ai-tools" element={<AiTools />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
