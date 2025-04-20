#!/bin/bash

# Print colorful messages
print_message() {
    echo -e "\033[1;34m==>\033[0m $1"
}

print_error() {
    echo -e "\033[1;31mError:\033[0m $1"
}

print_success() {
    echo -e "\033[1;32mSuccess:\033[0m $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    print_message "Visit https://nodejs.org/ to download and install Node.js"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    print_message "Visit https://www.python.org/downloads/ to download and install Python"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is not installed. Please install pip3 first."
    print_message "Visit https://pip.pypa.io/en/stable/installation/ to install pip"
    exit 1
fi

# Create and activate virtual environment
print_message "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_message "Installing Python dependencies..."
pip3 install pandas numpy scikit-learn

# Train the risk model
print_message "Training the risk prediction model..."
python3 src/utils/train_risk_model.py

# Deactivate virtual environment
deactivate

# Install Node.js dependencies
print_message "Installing Node.js dependencies..."
npm install

# Start the development server
print_message "Starting the development server..."
print_message "Once the server starts, you can access the application at http://localhost:5173"
npm run dev 