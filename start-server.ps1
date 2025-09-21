# Script to start the DocumentAnalyzer server with proper permissions
Write-Host "Starting DocumentAnalyzer server (dev with tsx)..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"

# Start the server using npm (tsx runs server/index.ts)
npm run dev
