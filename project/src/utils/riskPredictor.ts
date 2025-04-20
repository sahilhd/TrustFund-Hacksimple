interface RiskPredictionInput {
  number_of_products: number;
  num_crypto_accounts: number;
  num_trade_accounts: number;
  num_invest_accounts: number;
  num_cash_accounts: number;
  num_save_accounts: number;
}

interface StockPortfolio {
  'Investment Account': number;
  'Trading Account': number;
  'Crypto Account': number;
}

export const predictRiskLevel = (portfolio: StockPortfolio): number => {
  // Convert portfolio values to account counts
  // We'll consider accounts with value > 0 as active accounts
  const input: RiskPredictionInput = {
    number_of_products: 3, // We have 3 types of accounts
    num_crypto_accounts: portfolio['Crypto Account'] > 0 ? 1 : 0,
    num_trade_accounts: portfolio['Trading Account'] > 0 ? 1 : 0,
    num_invest_accounts: portfolio['Investment Account'] > 0 ? 1 : 0,
    num_cash_accounts: 0, // Not in our current portfolio
    num_save_accounts: 0, // Not in our current portfolio
  };

  // Calculate risk level based on portfolio composition
  // This is a simplified version that we can replace with actual model predictions
  const totalValue = Object.values(portfolio).reduce((a, b) => a + b, 0);
  const riskWeights = {
    'Crypto Account': 0.4,
    'Trading Account': 0.3,
    'Investment Account': 0.2,
  };

  const riskLevel = Object.entries(portfolio).reduce((acc, [account, value]) => {
    return acc + (value / totalValue) * (riskWeights[account as keyof typeof riskWeights] || 0);
  }, 0);

  return Math.min(Math.max(riskLevel, 0), 1); // Ensure between 0 and 1
};

export const getRiskLevelLabel = (riskLevel: number): string => {
  if (riskLevel < 0.3) return 'Low Risk';
  if (riskLevel < 0.6) return 'Moderate Risk';
  if (riskLevel < 0.8) return 'High Risk';
  return 'Very High Risk';
};

export const getRiskLevelColor = (riskLevel: number): string => {
  if (riskLevel < 0.3) return '#10B981'; // Green
  if (riskLevel < 0.6) return '#F59E0B'; // Yellow
  if (riskLevel < 0.8) return '#EF4444'; // Red
  return '#7F1D1D'; // Dark Red
}; 