import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

# Generate synthetic data for training
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    data = {
        'number_of_products': np.random.randint(1, 10, n_samples),
        'num_crypto_accounts': np.random.randint(0, 3, n_samples),
        'num_trade_accounts': np.random.randint(0, 2, n_samples),
        'num_invest_accounts': np.random.randint(0, 3, n_samples),
        'num_cash_accounts': np.random.randint(0, 2, n_samples),
        'num_save_accounts': np.random.randint(0, 2, n_samples)
    }
    
    # Calculate risk level based on account types
    # Higher weights for crypto and trading accounts (higher risk)
    risk_level = (
        0.3 * data['num_crypto_accounts'] +
        0.2 * data['num_trade_accounts'] +
        0.15 * data['num_invest_accounts'] +
        0.1 * data['num_cash_accounts'] +
        0.1 * data['num_save_accounts'] +
        0.15 * (data['number_of_products'] / 10)  # Normalize number of products
    )
    
    # Add some noise
    risk_level += np.random.normal(0, 0.1, n_samples)
    
    # Clip to 0-1 range
    risk_level = np.clip(risk_level, 0, 1)
    
    data['avg_portfolio_risk_level'] = risk_level
    return pd.DataFrame(data)

def train_model():
    # Generate synthetic data
    df = generate_synthetic_data()
    
    # Prepare features and target
    X = df.drop('avg_portfolio_risk_level', axis=1)
    y = df['avg_portfolio_risk_level']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Training R² score: {train_score:.4f}")
    print(f"Testing R² score: {test_score:.4f}")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model() 