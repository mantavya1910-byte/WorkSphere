@echo off
title WorkSphere - Starting Platform...
cd /d "%~dp0"
echo ============================================================
echo           Launching WorkSphere Platform
echo ============================================================
echo.
echo 1. Starting Express backend connected to Oracle 21c...
start "" cmd /k "title WorkSphere Server [Running on Port 5000] && node backend/server.js"

echo 2. Waiting 2 seconds for server initialization...
timeout /t 2 /nobreak >nul

echo 3. Automatically launching browser at http://localhost:5000 ...
start http://localhost:5000

echo.
echo ============================================================
echo   WorkSphere is live at: http://localhost:5000
echo   Keep the server window open while using the application.
echo ============================================================
exit
