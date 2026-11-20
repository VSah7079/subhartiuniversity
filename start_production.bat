@echo off
title Swami Vivekanand Subharti University - Production ERP Server
cls
echo =================================================================
echo   SWAMI VIVEKANAND SUBHARTI UNIVERSITY - PRODUCTION ERP LAUNCHER
echo =================================================================
echo.

echo [1/3] Checking environment and building production frontend assets...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed. Please check errors above.
    pause
    exit /b %errorlevel%
)
echo.

echo [2/3] Starting Enterprise Production Backend Server on Port 5001...
echo.
echo Application will be available at: http://localhost:5001
echo.

rem Launch browser after a brief 2-second delay in background
start "" /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5001"

rem Run the production server
node server/server.js
pause
