@echo off
title AUREVIA Automated Test Suite
echo ======================================================================
echo             Running AUREVIA 24-Point Test Suite                       
echo ======================================================================
echo.
set PATH=C:\Program Files\nodejs;%PATH%
cd /d %~dp0backend
npx tsx ../tests/run-tests.ts
echo.
pause
