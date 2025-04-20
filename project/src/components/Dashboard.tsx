import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, ArrowRight, Trash2, Plus, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { predictRiskLevel, getRiskLevelLabel, getRiskLevelColor } from '../utils/riskPredictor';

interface AssetAllocation {
  'Stock Portfolio': number;
  'Real Estate': number;
  'Cash': number;
}

interface Beneficiary {
  name: string;
  allocation: number;
  assetAllocations: AssetAllocation;
}

interface Asset {
  name: keyof AssetAllocation;
  value: number;
  growth: number;
  color: string;
}

interface AllocationModalProps {
  beneficiary: Beneficiary | null;
  assets: Asset[];
  beneficiaries: Beneficiary[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, assetAllocations: AssetAllocation) => void;
}

const AllocationModal: React.FC<AllocationModalProps> = ({ 
  beneficiary, 
  assets, 
  beneficiaries,
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation>(() => {
    if (beneficiary?.assetAllocations) {
      return { ...beneficiary.assetAllocations };
    }
    // Default to equal distribution if no allocations exist
    return {
      'Stock Portfolio': 33.33,
      'Real Estate': 33.33,
      'Cash': 33.33
    };
  });

  // Calculate total allocation per asset across all beneficiaries
  const calculateTotalAllocationPerAsset = (currentBeneficiary: string, newAllocations: AssetAllocation) => {
    const totals: AssetAllocation = {
      'Stock Portfolio': 0,
      'Real Estate': 0,
      'Cash': 0
    };

    beneficiaries.forEach((b: Beneficiary) => {
      if (b.name !== currentBeneficiary) {
        Object.keys(totals).forEach(asset => {
          totals[asset as keyof AssetAllocation] += b.assetAllocations[asset as keyof AssetAllocation];
        });
      }
    });

    // Add the new allocations
    Object.keys(totals).forEach(asset => {
      totals[asset as keyof AssetAllocation] += newAllocations[asset as keyof AssetAllocation];
    });

    return totals;
  };

  // Reset allocations when beneficiary changes
  React.useEffect(() => {
    if (beneficiary) {
      setAssetAllocations(beneficiary.assetAllocations);
    }
  }, [beneficiary]);

  const totalAllocations = beneficiary 
    ? calculateTotalAllocationPerAsset(beneficiary.name, assetAllocations)
    : { 'Stock Portfolio': 0, 'Real Estate': 0, 'Cash': 0 };

  const hasAllocationError = Object.values(totalAllocations).some(value => value > 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-[480px] relative z-40">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Manage Asset Distribution</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-900 font-medium mb-2">Beneficiary: {beneficiary?.name}</p>
          <p className="text-sm text-gray-600 mb-4">Adjust the percentage allocation for each asset</p>
          <div className="space-y-4">
            {assets.map((asset) => {
              const assetValue = asset.value;
              const allocationPercentage = assetAllocations[asset.name];
              const allocatedValue = (allocationPercentage / 100) * assetValue;

              return (
                <div key={asset.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }} />
                      {asset.name}
                    </label>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">
                        ${allocatedValue.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-500">
                        Total allocated: {totalAllocations[asset.name].toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={allocationPercentage}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setAssetAllocations(prev => ({
                        ...prev,
                        [asset.name]: newValue
                      }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              );
            })}
          </div>
          {hasAllocationError && (
            <p className="mt-4 text-sm text-red-600">
              Total allocation for one or more assets exceeds 100% across all beneficiaries.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (beneficiary && !hasAllocationError) {
                onSave(beneficiary.name, assetAllocations);
                onClose();
              }
            }}
            disabled={hasAllocationError}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

interface StockPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StockPortfolioModal: React.FC<StockPortfolioModalProps> = ({ isOpen, onClose }) => {
  const stockPortfolio = {
    'Investment Account': 500000,
    'Trading Account': 200000,
    'Crypto Account': 50000,
  };

  const totalValue = Object.values(stockPortfolio).reduce((a, b) => a + b, 0);
  const riskLevel = predictRiskLevel(stockPortfolio);
  const riskLabel = getRiskLevelLabel(riskLevel);
  const riskColor = getRiskLevelColor(riskLevel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-[480px] relative z-40">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Stock Portfolio Breakdown</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Risk Level Indicator */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Portfolio Risk Level</span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
            >
              {riskLabel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{ 
                width: `${riskLevel * 100}%`,
                backgroundColor: riskColor
              }}
            />
          </div>
          <div className="text-xs text-gray-500 text-right mt-1">
            {Math.round(riskLevel * 100)}% Risk
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(stockPortfolio).map(([account, value]) => {
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return (
              <div key={account} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{account}</span>
                  <span className="text-sm text-gray-600">${value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-right">{percentage}%</div>
              </div>
            );
          })}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Portfolio Value</span>
              <span className="font-medium text-gray-900">${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockPortfolioModalOpen, setIsStockPortfolioModalOpen] = useState(false);
  const [trustFund, setTrustFund] = useState({
    totalValue: 1250000,
    assets: [
      { name: 'Stock Portfolio' as const, value: 750000, growth: 12.5, color: '#EF4444' },
      { name: 'Real Estate' as const, value: 400000, growth: 5.2, color: '#3B82F6' },
      { name: 'Cash' as const, value: 100000, growth: 0.5, color: '#10B981' },
    ] as Asset[],
    beneficiaries: [
      { 
        name: 'John Smith', 
        allocation: 50,
        assetAllocations: {
          'Stock Portfolio': 60,
          'Real Estate': 30,
          'Cash': 10
        }
      },
      { 
        name: 'Sarah Smith', 
        allocation: 50,
        assetAllocations: {
          'Stock Portfolio': 60,
          'Real Estate': 30,
          'Cash': 10
        }
      },
    ],
  });

  const handleDelete = (beneficiaryName: string) => {
    const newBeneficiaries = trustFund.beneficiaries.filter(
      (b) => b.name !== beneficiaryName
    );
    setTrustFund({ ...trustFund, beneficiaries: newBeneficiaries });
  };

  const handleAddBeneficiary = () => {
    const name = prompt('Enter beneficiary name:');
    if (name) {
      const equalShare = 100 / trustFund.assets.length;
      const assetAllocations: AssetAllocation = {
        'Stock Portfolio': equalShare,
        'Real Estate': equalShare,
        'Cash': equalShare
      };

      const newBeneficiaries = [
        ...trustFund.beneficiaries,
        { 
          name, 
          allocation: 0,
          assetAllocations
        }
      ];
      setTrustFund({ ...trustFund, beneficiaries: newBeneficiaries });
    }
  };

  const handleAllocationUpdate = (name: string, assetAllocations: AssetAllocation) => {
    const newBeneficiaries = trustFund.beneficiaries.map((b) =>
      b.name === name ? { ...b, assetAllocations } : b
    );
    setTrustFund({ ...trustFund, beneficiaries: newBeneficiaries });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${trustFund.totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-900" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Asset Growth (YTD)</p>
              <p className="text-2xl font-bold text-green-600">+8.7%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">
                {trustFund.beneficiaries.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-gray-900" />
          </div>
        </div>
      </div>

      {/* Asset Allocation Section */}
      <div className="flex gap-6">
        {/* Asset List */}
        <div className="flex-[6] bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h2>
          <div className="space-y-4">
            {trustFund.assets.map((asset, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{asset.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      ${asset.value.toLocaleString()}
                    </p>
                    <span className={`text-sm ${
                      asset.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.growth > 0 ? '+' : ''}{asset.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex-[4] bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trustFund.assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trustFund.assets.map((asset, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={asset.color}
                      onClick={() => {
                        if (asset.name === 'Stock Portfolio') {
                          setIsStockPortfolioModalOpen(true);
                        }
                      }}
                      style={{ cursor: asset.name === 'Stock Portfolio' ? 'pointer' : 'default' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Beneficiaries */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Beneficiaries</h2>
          <button
            onClick={handleAddBeneficiary}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-50"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {trustFund.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
              <div 
                onClick={() => {
                  setSelectedBeneficiary(beneficiary);
                  setIsModalOpen(true);
                }}
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{beneficiary.name}</p>
                    <div className="flex gap-4">
                      {trustFund.assets.map((asset) => (
                        <div key={asset.name} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span className="text-sm text-gray-600">
                            {beneficiary.assetAllocations[asset.name]}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(beneficiary.name);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 self-center rounded-full hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AllocationModal
        beneficiary={selectedBeneficiary}
        assets={trustFund.assets}
        beneficiaries={trustFund.beneficiaries}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        onSave={handleAllocationUpdate}
      />

      <StockPortfolioModal
        isOpen={isStockPortfolioModalOpen}
        onClose={() => setIsStockPortfolioModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;