import React, { useState } from 'react';
import { Users, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TrustFundSetup from './components/TrustFundSetup';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex pt-6">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-lg mr-6">
        <nav className="py-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
              currentView === 'dashboard'
                ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('setup')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
              currentView === 'setup'
                ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5" />
            Setup
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {currentView === 'dashboard' ? <Dashboard /> : <TrustFundSetup />}
        </div>
      </div>
    </div>
  );
}

export default App;