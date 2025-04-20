export interface TrustFundData {
  settlor: {
    fullName: string;
    dateOfBirth: string;
    sin: string;
    address: string;
    phone: string;
    email: string;
  };
  trustee: {
    fullName: string;
    dateOfBirth: string;
    sin: string;
    address: string;
    phone: string;
    email: string;
  };
  beneficiaries: {
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    sin: string;
    address: string;
    phone: string;
    email: string;
    distributionInstructions: string;
  }[];
  trustDetails: {
    name: string;
    type: 'inter-vivos' | 'testamentary' | 'other';
    otherType?: string;
    purpose: string;
    initialProperty: string;
  };
  additionalProvisions: {
    duration: string;
    trusteePowers: string;
    successorTrustee: string;
    distributionPlan: string;
    specialInstructions: string;
  };
  professionalAdvisors: {
    lawyer: {
      name: string;
      contact: string;
    };
    accountant: {
      name: string;
      contact: string;
    };
  };
  financialPlanning: {
    currentIncome: string;
    goalAmount: string;
    targetDate: string;
    financialGoal: string;
  };
  trustAssets: {
    name: string;
    value: string;
  }[];
}