import React, { useState } from 'react';
import App from '../App';
import { Search, User, Gift } from 'lucide-react';
import WLogo from '../../WealthsimpleWLogo.png';

// Placeholder components for other sections
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-gray-50">
    <h1 className="text-2xl text-gray-600">{title} - Coming Soon</h1>
  </div>
);

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Trust');
  const [activeNavItem] = useState('Generations');

  const navItems = ['Home', 'Move', 'Activity', 'Generations', 'Mortgage'];
  const tabs = ['Trust', 'Will', 'RESP', 'RRSP', '+'];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 relative z-50 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side nav items */}
            <div className="flex items-center space-x-8">
              <img src={WLogo} alt="Wealthsimple" className="h-8 w-auto" />
              {navItems.map((item) => (
                <button
                  key={item}
                  className={`px-3 py-5 text-base font-medium tracking-tight relative ${
                    activeNavItem === item
                      ? 'text-gray-900'
                      : 'text-[#666666] hover:text-gray-900'
                  }`}
                >
                  {item}
                  {activeNavItem === item && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-6">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name or symbol"
                  className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-base text-gray-900 placeholder-gray-400 w-72 focus:outline-none focus:border-gray-300"
                />
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <Gift className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Future Page Tabs */}
      <div className="border-b border-gray-200 relative z-50 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-base font-medium tracking-tight relative ${
                  activeTab === tab
                    ? 'text-gray-900'
                    : 'text-[#666666] hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-screen-2xl mx-auto px-6">
        {activeTab === 'Trust' ? (
          <App />
        ) : (
          <PlaceholderPage title={activeTab === '+' ? 'Add More' : activeTab} />
        )}
      </div>
    </div>
  );
};

export default MainLayout; 