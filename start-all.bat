@echo off
title AUREVIA Launcher
echo ======================================================================
echo             Starting AUREVIA Distributed Travel Platform              
echo ======================================================================
echo.

echo Launching Backend Microservices Cluster (Gateway + 8 Services)...
start "AUREVIA Backend Services (Ports 5000-5008)" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && cd /d %~dp0backend && npx tsx start-all.ts"

timeout /t 3 /nobreak >nul

echo Launching Frontend Web Application (Vite + React)...
start "AUREVIA Frontend (Port 3000)" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && cd /d %~dp0frontend && npm run dev"

echo.
echo ======================================================================
echo AUREVIA is now running!
echo.
echo   Local PC Access:     http://localhost:3000
echo   Mobile Phone / Wi-Fi: http://10.238.153.74:3000
echo   API Gateway:         http://localhost:5000
echo.
echo   For Worldwide Public Link (any device on cellular data):
echo   Double-click: create-live-link.bat
echo.
echo Demo Accounts:
echo   Traveler: traveler@aurevia.com / Traveler@12345
echo   Admin:    admin@aurevia.com    / Admin@12345
echo.
echo (You can close this launcher window; the two service windows will stay active)
echo ======================================================================
pause
