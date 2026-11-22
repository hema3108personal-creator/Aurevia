@echo off
title Deploy AUREVIA to Surge
echo ======================================================================
echo             Deploying AUREVIA Frontend to Surge.sh                    
echo ======================================================================
echo.
echo Deploying pre-compiled production build (frontend\dist)...
echo.
echo Note: If this is your first time running Surge:
echo   - Type your email and create a password when prompted.
echo   - Surge will instantly publish your site and give you a live link!
echo.
set PATH=C:\Program Files\nodejs;%PATH%
npx surge "%~dp0frontend\dist"
echo.
pause
