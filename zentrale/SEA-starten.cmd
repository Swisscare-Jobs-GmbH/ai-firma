@echo off
chcp 65001 >nul
title SEA
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js wurde nicht gefunden.
  echo Bitte zuerst Node.js installieren: https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo.
echo   SEA startet auf http://127.0.0.1:8020
echo.

start "SEA Server" node server.js
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8020

echo   Der Server laeuft jetzt im Fenster "SEA Server".
echo   Zum Beenden dieses Server-Fenster schliessen.
echo.
echo   Dieses Fenster kannst du schliessen.
timeout /t 4 /nobreak >nul
