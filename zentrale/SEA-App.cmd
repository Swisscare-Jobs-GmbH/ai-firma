@echo off
chcp 65001 >nul
title SEA
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte installieren: https://nodejs.org
  pause
  exit /b 1
)

REM Server nur starten, wenn Port 8020 noch nicht lauscht
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',8020);$c.Close();exit 0}catch{exit 1}" >nul 2>nul
if errorlevel 1 (
  start "SEA Server" /min cmd /c "node server.js"
  powershell -NoProfile -Command "for($i=0;$i -lt 40;$i++){try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',8020);$c.Close();break}catch{Start-Sleep -Milliseconds 300}}" >nul 2>nul
)

set "URL=http://127.0.0.1:8020"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" goto :edge
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" goto :chrome
start "" "%URL%"
goto :eof

:edge
start "" "%EDGE%" --app=%URL% --window-size=1280,860
goto :eof

:chrome
start "" "%CHROME%" --app=%URL% --window-size=1280,860
goto :eof
