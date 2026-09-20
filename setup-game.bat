@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo [Mistbound] Installing game dependencies...
call npm --prefix game ci
if errorlevel 1 (
  echo.
  echo [ERROR] npm ci failed.
  echo Check that Node.js 20.19+ is installed and that npm can access the registry.
  pause
  exit /b 1
)

echo.
echo [Mistbound] Game dependencies are ready.
pause
