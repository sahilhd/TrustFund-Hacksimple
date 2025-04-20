import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Download, Calculator } from 'lucide-react';
import { TrustFundData } from '../types/trust';
import { generateTrustDocument } from '../utils/pdfGenerator';

const initialTrustData: TrustFundData = {
  settlor: {
    fullName: '',
    dateOfBirth: '',
    sin: '',
    address: '',
    phone: '',
    email: '',
  },
  trustee: {
    fullName: '',
    dateOfBirth: '',
    sin: '',
    address: '',
    phone: '',
    email: '',
  },
  beneficiaries: [{
    fullName: '',
    relationship: '',
    dateOfBirth: '',
    sin: '',
    address: '',
    phone: '',
    email: '',
    distributionInstructions: '',
  }],
  trustDetails: {
    name: '',
    type: 'inter-vivos',
    purpose: '',
    initialProperty: '',
  },
  additionalProvisions: {
    duration: '',
    trusteePowers: '',
    successorTrustee: '',
    distributionPlan: '',
    specialInstructions: '',
  },
  professionalAdvisors: {
    lawyer: {
      name: '',
      contact: '',
    },
    accountant: {
      name: '',
      contact: '',
    },
  },
  financialPlanning: {
    currentIncome: '',
    goalAmount: '',
    targetDate: '',
    financialGoal: '',
  },
  trustAssets: [{ name: '', value: '' }],
};

const TrustFundSetup = () => {
  const [trustData, setTrustData] = useState<TrustFundData>(initialTrustData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCalculation, setShowCalculation] = useState(false);
  const [monthlyContribution, setMonthlyContribution] = useState<number | null>(null);

  useEffect(() => {
    calculateMonthlyContribution();
  }, [trustData.financialPlanning.goalAmount, trustData.financialPlanning.targetDate]);

  const calculateMonthlyContribution = () => {
    const { goalAmount, targetDate } = trustData.financialPlanning;
    
    if (!goalAmount || !targetDate) {
      setMonthlyContribution(null);
      return;
    }
    
    const goalAmountNum = parseFloat(goalAmount);
    const targetDateObj = new Date(targetDate);
    const currentDate = new Date();
    
    if (isNaN(goalAmountNum) || targetDateObj <= currentDate) {
      setMonthlyContribution(null);
      return;
    }
    
    const monthsDiff = (targetDateObj.getFullYear() - currentDate.getFullYear()) * 12 + 
                       (targetDateObj.getMonth() - currentDate.getMonth());
    
    if (monthsDiff <= 0) {
      setMonthlyContribution(null);
      return;
    }
    
    const contribution = goalAmountNum / monthsDiff;
    setMonthlyContribution(contribution);
  };

  const handleSettlorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrustData({
      ...trustData,
      settlor: {
        ...trustData.settlor,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleTrusteeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrustData({
      ...trustData,
      trustee: {
        ...trustData.trustee,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleBeneficiaryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newBeneficiaries = [...trustData.beneficiaries];
    newBeneficiaries[index] = {
      ...newBeneficiaries[index],
      [e.target.name]: e.target.value,
    };
    setTrustData({
      ...trustData,
      beneficiaries: newBeneficiaries,
    });
  };

  const handleFinancialPlanningChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTrustData({
      ...trustData,
      financialPlanning: {
        ...trustData.financialPlanning,
        [e.target.name]: e.target.value,
      },
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const addBeneficiary = () => {
    setTrustData({
      ...trustData,
      beneficiaries: [
        ...trustData.beneficiaries,
        {
          fullName: '',
          relationship: '',
          dateOfBirth: '',
          sin: '',
          address: '',
          phone: '',
          email: '',
          distributionInstructions: '',
        },
      ],
    });
  };

  const removeBeneficiary = (index: number) => {
    setTrustData({
      ...trustData,
      beneficiaries: trustData.beneficiaries.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trust Fund Data:', trustData);
    // Here you would typically save the data to your backend
  };

  const handleDownloadPDF = async () => {
    await generateTrustDocument(trustData);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Setup</h1>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 text-white rounded-md hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Download Trust Document
        </button>
      </div>
      
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <div className={`flex items-center ${currentStep === 1 ? 'text-gray-900' : 'text-gray-500'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-2 
                ${currentStep === 1 ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}>1</span>
              Basic Info
            </div>
            <div className={`flex items-center ${currentStep === 2 ? 'text-gray-900' : 'text-gray-500'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-2
                ${currentStep === 2 ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}>2</span>
              Beneficiaries
            </div>
            <div className={`flex items-center ${currentStep === 3 ? 'text-gray-900' : 'text-gray-500'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-2
                ${currentStep === 3 ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}>3</span>
              Trust Details
            </div>
            <div className={`flex items-center ${currentStep === 4 ? 'text-gray-900' : 'text-gray-500'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-2
                ${currentStep === 4 ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}>4</span>
              Financial Goals
            </div>
            <div className={`flex items-center ${currentStep === 5 ? 'text-gray-900' : 'text-gray-500'}`}>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-2
                ${currentStep === 5 ? 'border-gray-900 bg-gray-100' : 'border-gray-300'}`}>5</span>
              Review
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">1. Settlor Information</h2>
                <button
                  type="button"
                  onClick={() => {
                    setTrustData({
                      ...trustData,
                      settlor: {
                        fullName: 'Mark Smith',
                        dateOfBirth: '1975-07-02',
                        sin: 'DEMO-123-456-789',
                        address: '123 Example Street, Sampletown, XY 12345',
                        phone: '(555) 123-4567',
                        email: 'mark.smith@wealthsimple.com',
                      }
                    });
                  }}
                  className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Import from Wealthsimple
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={trustData.settlor.fullName}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={trustData.settlor.dateOfBirth}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Social Insurance Number</label>
                  <input
                    type="text"
                    name="sin"
                    value={trustData.settlor.sin}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={trustData.settlor.address}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={trustData.settlor.phone}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={trustData.settlor.email}
                    onChange={handleSettlorChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Trustee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={trustData.trustee.fullName}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={trustData.trustee.dateOfBirth}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Social Insurance Number</label>
                  <input
                    type="text"
                    name="sin"
                    value={trustData.trustee.sin}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={trustData.trustee.address}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={trustData.trustee.phone}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={trustData.trustee.email}
                    onChange={handleTrusteeChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-gray-900 py-2 px-6 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Next: Beneficiaries
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">3. Beneficiaries</h2>
                <button
                  type="button"
                  onClick={addBeneficiary}
                  className="text-gray-900 hover:text-gray-700 flex items-center gap-1"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add Beneficiary
                </button>
              </div>

              {trustData.beneficiaries.map((beneficiary, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Beneficiary {index + 1}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeBeneficiary(index)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <MinusCircle className="h-5 w-5" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Legal Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={beneficiary.fullName}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship to Settlor</label>
                      <input
                        type="text"
                        name="relationship"
                        value={beneficiary.relationship}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={beneficiary.dateOfBirth}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Social Insurance Number</label>
                      <input
                        type="text"
                        name="sin"
                        value={beneficiary.sin}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={beneficiary.address}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Distribution Instructions</label>
                      <textarea
                        name="distributionInstructions"
                        value={beneficiary.distributionInstructions}
                        onChange={(e) => handleBeneficiaryChange(index, e)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="border border-gray-300 py-2 px-6 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-gray-900 py-2 px-6 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Next: Trust Details
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Trust Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name of the Trust</label>
                  <input
                    type="text"
                    name="name"
                    value={trustData.trustDetails.name}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      trustDetails: {
                        ...trustData.trustDetails,
                        name: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="e.g., Smith Family Trust"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type of Trust</label>
                  <div className="mt-1">
                    <select
                      name="type"
                      value={trustData.trustDetails.type}
                      onChange={(e) => setTrustData({
                        ...trustData,
                        trustDetails: {
                          ...trustData.trustDetails,
                          type: e.target.value as 'inter-vivos' | 'testamentary' | 'other'
                        }
                      })}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="inter-vivos">Inter Vivos (Living Trust)</option>
                      <option value="testamentary">Testamentary Trust</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {trustData.trustDetails.type === 'other' && (
                    <input
                      type="text"
                      name="otherType"
                      value={trustData.trustDetails.otherType || ''}
                      onChange={(e) => setTrustData({
                        ...trustData,
                        trustDetails: {
                          ...trustData.trustDetails,
                          otherType: e.target.value
                        }
                      })}
                      className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      placeholder="Please specify the type of trust"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Purpose of the Trust</label>
                  <textarea
                    name="purpose"
                    value={trustData.trustDetails.purpose}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      trustDetails: {
                        ...trustData.trustDetails,
                        purpose: e.target.value
                      }
                    })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="e.g., To provide for the education and welfare of my children"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Initial Trust Property</label>
                    <button
                      type="button"
                      onClick={() => {
                        setTrustData({
                          ...trustData,
                          trustAssets: [
                            { name: 'Stock Portfolio', value: '750000' },
                            { name: 'Real Estate', value: '400000' },
                            { name: 'Cash', value: '100000' }
                          ]
                        });
                      }}
                      className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Import from Wealthsimple
                    </button>
                  </div>
                  
                  <div className="space-y-4 mt-2">
                    {trustData.trustAssets.map((asset, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={asset.name}
                            onChange={(e) => {
                              const newAssets = [...trustData.trustAssets];
                              newAssets[index].name = e.target.value;
                              setTrustData({
                                ...trustData,
                                trustAssets: newAssets
                              });
                            }}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="Asset description (e.g., Stock Portfolio)"
                          />
                        </div>
                        <div className="w-1/3">
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={asset.value}
                              onChange={(e) => {
                                const newAssets = [...trustData.trustAssets];
                                newAssets[index].value = e.target.value;
                                setTrustData({
                                  ...trustData,
                                  trustAssets: newAssets
                                });
                              }}
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (trustData.trustAssets.length > 1) {
                              setTrustData({
                                ...trustData,
                                trustAssets: trustData.trustAssets.filter((_, i) => i !== index)
                              });
                            }
                          }}
                          className={`p-2 rounded-full ${trustData.trustAssets.length > 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-300'}`}
                          disabled={trustData.trustAssets.length <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setTrustData({
                          ...trustData,
                          trustAssets: [...trustData.trustAssets, { name: '', value: '' }]
                        });
                      }}
                      className="mt-2 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Another Asset
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Additional Provisions</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration of the Trust</label>
                  <select
                    name="duration"
                    value={trustData.additionalProvisions.duration}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      additionalProvisions: {
                        ...trustData.additionalProvisions,
                        duration: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="">Select duration...</option>
                    <option value="Until beneficiaries reach age of majority">Until beneficiaries reach age of majority</option>
                    <option value="Until beneficiaries reach age 25">Until beneficiaries reach age 25</option>
                    <option value="Until beneficiaries reach age 30">Until beneficiaries reach age 30</option>
                    <option value="For the lifetime of the settlor">For the lifetime of the settlor</option>
                    <option value="For the lifetime of the beneficiaries">For the lifetime of the beneficiaries</option>
                    <option value="Perpetual (as allowed by law)">Perpetual (as allowed by law)</option>
                    <option value="custom">Custom duration...</option>
                  </select>
                  {trustData.additionalProvisions.duration === 'custom' && (
                    <input
                      type="text"
                      placeholder="Specify custom duration"
                      className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      onChange={(e) => setTrustData({
                        ...trustData,
                        additionalProvisions: {
                          ...trustData.additionalProvisions,
                          duration: e.target.value
                        }
                      })}
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Powers of the Trustee(s)</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="power-invest"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="power-invest" className="ml-2 block text-sm text-gray-700">
                        Power to invest trust assets
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="power-sell"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="power-sell" className="ml-2 block text-sm text-gray-700">
                        Power to sell or exchange trust property
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="power-borrow"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="power-borrow" className="ml-2 block text-sm text-gray-700">
                        Power to borrow money
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="power-distribute"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="power-distribute" className="ml-2 block text-sm text-gray-700">
                        Power to make distributions to beneficiaries
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="power-tax"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="power-tax" className="ml-2 block text-sm text-gray-700">
                        Power to handle tax matters
                      </label>
                    </div>
                  </div>
                  <textarea
                    name="trusteePowers"
                    value={trustData.additionalProvisions.trusteePowers}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      additionalProvisions: {
                        ...trustData.additionalProvisions,
                        trusteePowers: e.target.value
                      }
                    })}
                    rows={2}
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Additional trustee powers..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Successor Trustee(s)</label>
                  <select
                    name="successorTrustee"
                    value={trustData.additionalProvisions.successorTrustee}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      additionalProvisions: {
                        ...trustData.additionalProvisions,
                        successorTrustee: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="">Select successor trustee arrangement...</option>
                    <option value="Spouse or partner of the settlor">Spouse or partner of the settlor</option>
                    <option value="Adult child of the settlor">Adult child of the settlor</option>
                    <option value="Sibling of the settlor">Sibling of the settlor</option>
                    <option value="Professional trustee or trust company">Professional trustee or trust company</option>
                    <option value="custom">Custom arrangement...</option>
                  </select>
                  {trustData.additionalProvisions.successorTrustee === 'custom' && (
                    <input
                      type="text"
                      placeholder="Specify successor trustee arrangement"
                      className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      onChange={(e) => setTrustData({
                        ...trustData,
                        additionalProvisions: {
                          ...trustData.additionalProvisions,
                          successorTrustee: e.target.value
                        }
                      })}
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Plan</label>
                  <select
                    name="distributionPlan"
                    value={trustData.additionalProvisions.distributionPlan}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      additionalProvisions: {
                        ...trustData.additionalProvisions,
                        distributionPlan: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="">Select distribution plan...</option>
                    <option value="Equal distributions to all beneficiaries">Equal distributions to all beneficiaries</option>
                    <option value="Distributions based on need">Distributions based on need</option>
                    <option value="Distributions at specific ages">Distributions at specific ages</option>
                    <option value="Distributions for specific purposes only">Distributions for specific purposes only</option>
                    <option value="custom">Custom distribution plan...</option>
                  </select>
                  {trustData.additionalProvisions.distributionPlan === 'custom' && (
                    <textarea
                      placeholder="Describe your custom distribution plan"
                      rows={3}
                      className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                      onChange={(e) => setTrustData({
                        ...trustData,
                        additionalProvisions: {
                          ...trustData.additionalProvisions,
                          distributionPlan: e.target.value
                        }
                      })}
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="instruction-education"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="instruction-education" className="ml-2 block text-sm text-gray-700">
                        Funds for education expenses
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="instruction-health"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="instruction-health" className="ml-2 block text-sm text-gray-700">
                        Funds for healthcare expenses
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="instruction-housing"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="instruction-housing" className="ml-2 block text-sm text-gray-700">
                        Funds for housing or mortgage payments
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="instruction-business"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="instruction-business" className="ml-2 block text-sm text-gray-700">
                        Funds for starting a business
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="instruction-other"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <label htmlFor="instruction-other" className="ml-2 block text-sm text-gray-700">
                        Other special instructions
                      </label>
                    </div>
                  </div>
                  <textarea
                    name="specialInstructions"
                    value={trustData.additionalProvisions.specialInstructions}
                    onChange={(e) => setTrustData({
                      ...trustData,
                      additionalProvisions: {
                        ...trustData.additionalProvisions,
                        specialInstructions: e.target.value
                      }
                    })}
                    rows={3}
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Any additional special instructions..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="border border-gray-300 py-2 px-6 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-gray-900 py-2 px-6 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Next: Financial Goals
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Financial Goals</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Annual Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="currentIncome"
                  value={trustData.financialPlanning.currentIncome}
                  onChange={handleFinancialPlanningChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Goal Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="goalAmount"
                  value={trustData.financialPlanning.goalAmount}
                  onChange={handleFinancialPlanningChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Achievement Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={trustData.financialPlanning.targetDate}
                onChange={handleFinancialPlanningChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  calculateMonthlyContribution();
                  setShowCalculation(true);
                }}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Calculate Monthly Contribution
              </button>
            </div>
            
            {showCalculation && monthlyContribution !== null && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-center mb-2">
                  <h3 className="font-medium text-gray-900">Monthly Contribution Needed</h3>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowCalculation(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-gray-700">
                    To reach your goal of <span className="font-semibold">${parseFloat(trustData.financialPlanning.goalAmount).toLocaleString()}</span> by{' '}
                    <span className="font-semibold">{new Date(trustData.financialPlanning.targetDate).toLocaleDateString()}</span>,
                    you need to contribute:
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    ${monthlyContribution.toFixed(2)} per month
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Financial Goals
              </label>
              <textarea
                name="financialGoal"
                value={trustData.financialPlanning.financialGoal}
                onChange={handleFinancialPlanningChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                rows={4}
                placeholder="e.g., I want to create a college fund for my children..."
              />
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="border border-gray-300 py-2 px-6 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-gray-900 py-2 px-6 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Your Trust Fund Setup</h2>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Declarations</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="declaration1"
                        name="declaration1"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="declaration1" className="font-medium text-gray-700">
                        I confirm that all information provided is accurate and complete to the best of my knowledge.
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="declaration2"
                        name="declaration2"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="declaration2" className="font-medium text-gray-700">
                        I understand that the creation of a trust has legal and tax implications, and I have consulted or will consult with appropriate professionals.
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="declaration3"
                        name="declaration3"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="declaration3" className="font-medium text-gray-700">
                        I consent to the use of this information for the purpose of drafting a trust document.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">Settlor Information</h3>
                  <p className="text-gray-600">
                    {trustData.settlor.fullName || "Not provided"} • 
                    {trustData.settlor.email || "No email"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Trustee Information</h3>
                  <p className="text-gray-600">
                    {trustData.trustee.fullName || "Not provided"} • 
                    {trustData.trustee.email || "No email"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Beneficiaries</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {trustData.beneficiaries.map((beneficiary, index) => (
                      <li key={index}>
                        {beneficiary.fullName || `Beneficiary ${index + 1}`} ({beneficiary.relationship || "Relationship not specified"})
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Trust Details</h3>
                  <p className="text-gray-600">
                    Name: {trustData.trustDetails.name || "Not provided"} • 
                    Type: {trustData.trustDetails.type === 'other' ? trustData.trustDetails.otherType : trustData.trustDetails.type}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Purpose: {trustData.trustDetails.purpose || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Financial Goals</h3>
                  <p className="text-gray-600">
                    Target Amount: ${trustData.financialPlanning.goalAmount || "0"} • 
                    {monthlyContribution && `Recommended Monthly Contribution: $${monthlyContribution.toFixed(2)}`}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {trustData.financialPlanning.financialGoal || "No specific goals provided"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="border border-gray-300 py-2 px-6 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-gray-900 py-2 px-6 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Create Trust Fund
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TrustFundSetup;