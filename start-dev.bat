@echo off
REM Script pour lancer les serveurs de développement backend et frontend

ECHO "=================================================="
ECHO "=   Lancement du serveur de developpement DIGI THR   ="
ECHO "=================================================="

REM Installe les dépendances si le dossier node_modules n'existe pas
IF NOT EXIST .\node_modules ( 
  ECHO "Installation des dependances..."
  CALL npm install
)

REM Lance le serveur backend en arrière-plan
ECHO "Lancement du serveur backend sur le port 3001..."
start "Backend" npm run server

REM Attendre quelques secondes pour que le serveur backend demarre
ping 127.0.0.1 -n 5 > nul

REM Lance le serveur frontend (Vite)
ECHO "Lancement du serveur frontend sur le port 3000..."
npm run dev

ECHO "Les serveurs sont lances. Le frontend est accessible sur http://localhost:3000"
