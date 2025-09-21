# Script PowerShell pour démarrer l'application en mode développement
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DIGI THR - Mode Développement" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Définir les variables d'environnement
$env:NODE_ENV = "development"
$env:PORT = "3001"

Write-Host "Variables d'environnement définies:" -ForegroundColor Yellow
Write-Host "NODE_ENV = $env:NODE_ENV" -ForegroundColor Cyan
Write-Host "PORT = $env:PORT" -ForegroundColor Cyan
Write-Host ""

Write-Host "Démarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host ""

# Démarrer le serveur
npm run dev

