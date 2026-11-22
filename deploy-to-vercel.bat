@echo off
title Deploy AUREVIA to Vercel
echo ======================================================================
echo             Deploying AUREVIA to Vercel                               
echo ======================================================================
echo.
echo Deploying frontend to Vercel high-speed global edge network...
echo.
echo Note: If prompted, log in with your Vercel account or GitHub in the browser.
echo.
set PATH=C:\Program Files\nodejs;%PATH%
npx vercel "%~dp0frontend" --prod
echo.
pause
