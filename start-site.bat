@echo off
echo ========================================
echo    DIGI THR - Site Web Demarrage
echo ========================================
echo.

cd /d "C:\Users\hp\Desktop\ABDELFATTAH\DocumentAnalyzer (2)\DocumentAnalyzer"

echo Verification du repertoire...
if not exist "package.json" (
    echo ERREUR: Fichier package.json non trouve!
    echo Assurez-vous d'etre dans le bon repertoire.
    pause
    exit /b 1
)

echo Installation des dependances...
npm install --no-optional --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Probleme avec npm install
    echo Le site fonctionnera quand meme avec les donnees en memoire
    echo.
)

echo.
echo Demarrage du serveur de developpement...
echo.
echo Votre site DIGI THR sera disponible sur:
echo http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm run dev

pause
