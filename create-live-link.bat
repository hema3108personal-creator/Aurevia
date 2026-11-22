@echo off
title AUREVIA Public Live Link Creator
echo ======================================================================
echo             AUREVIA - Generate Instant Worldwide Public Link           
echo ======================================================================
echo.
echo Make sure AUREVIA is running (via start-all.bat) before creating link.
echo.
echo Generating secure public HTTPS link for your AUREVIA app (Port 3000)...
echo.
echo Connecting to tunnel...
echo (When the link appears below, copy and open it on your phone or any device!)
echo.
ssh -o StrictHostKeyChecking=no -p 443 -R0:localhost:3000 a.pinggy.io
pause
