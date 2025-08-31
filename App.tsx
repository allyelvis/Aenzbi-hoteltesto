
import React, { useState, useEffect } from 'react';
// FIX: Updated imports for react-router-dom v5 compatibility.
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RestaurantPOS } from './components/RestaurantPOS';
import { HotelPMS } from './components/HotelPMS';
import { Inventory } from './components/Inventory';
import { AiTools } from './components/AiTools';
import { Page } from './types';

// FIX: Added helper to derive the current page from the URL hash.
const getPageFromPath = (path: string): Page => {
  if (path.includes(Page.POS)) return Page.POS;
  if (path.includes(Page.PMS)) return Page.PMS;
  if (path.includes(Page.Inventory)) return Page.Inventory;
  if (path.includes(Page.AITools)) return Page.AITools;
  if (path.includes(Page.Dashboard)) return Page.Dashboard;
  return Page.Dashboard;
};

const App: React.FC = () => {
  // FIX: Initialize currentPage state from the URL hash for correct initial rendering.
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromPath(window.location.hash));

  // FIX: Added useEffect to listen for hash changes and keep currentPage state in sync.
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromPath(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getPageTitle = (page: Page): string => {
    switch (page) {
      case Page.Dashboard:
        return 'Dashboard Overview';
      case Page.POS:
        return 'Restaurant Point of Sale';
      case Page.PMS:
        return 'Property Management System';
      case Page.Inventory:
        return 'Inventory Management';
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
            {/* FIX: Replaced v6 <Routes> with v5 <Switch> and updated Route syntax. */}
            <Switch>
              <Route exact path="/" >
                <Redirect to="/dashboard" />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/pos">
                <RestaurantPOS />
              </Route>
              <Route path="/pms">
                <HotelPMS />
              </Route>
              <Route path="/inventory">
                <Inventory />
              </Route>
              <Route path="/ai-tools">
                <AiTools />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
