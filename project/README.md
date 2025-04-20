# Trust Fund Management System

A modern web application for managing trust funds with risk assessment capabilities.

## Prerequisites

Before running the setup script, make sure you have:
- Node.js installed (https://nodejs.org/)
- Python 3 installed (https://www.python.org/downloads/)
- pip3 installed (usually comes with Python)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd project
```

3. Run the setup script:
```bash
./setup.sh
```

That's it! The script will:
- Set up the Python environment
- Train the risk prediction model
- Install all Node.js dependencies
- Start the development server

Once the server starts, you can access the application at http://localhost:5173

## Features

- Trust fund portfolio management
- Asset allocation visualization
- Risk level prediction using machine learning
- Beneficiary management
- Professional PDF document generation

## Project Structure

```
project/
├── src/
│   ├── components/     # React components
│   ├── utils/         # Utility functions and ML model
│   ├── types/         # TypeScript type definitions
│   └── assets/        # Static assets
├── setup.sh           # Setup script
└── README.md          # This file
```

## Troubleshooting

If you encounter any issues:

1. Make sure all prerequisites are installed
2. Check if the setup script has execute permissions:
   ```bash
   chmod +x setup.sh
   ```
3. If the Python virtual environment fails to create, try:
   ```bash
   python3 -m venv venv
   ```
4. If npm install fails, try:
   ```bash
   npm cache clean --force
   npm install
   ``` 