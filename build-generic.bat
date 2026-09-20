@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\build-channel-apk.ps1" -Channel Generic
set "result=%ERRORLEVEL%"
echo.
if not "%result%"=="0" echo Generic build failed with code %result%.
pause
exit /b %result%
