@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

set "LOG_DIR=%~dp0log\build"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%" >nul 2>&1
for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "STAMP=%%I"
set "LOG_FILE=%LOG_DIR%\build-generic-%STAMP%.log"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\build-channel-apk.ps1" -Channel Generic -LogFile "%LOG_FILE%"
set "result=%ERRORLEVEL%"
echo.
if not "%result%"=="0" echo 通用版打包失败，错误码：%result%
echo 日志：%LOG_FILE%
pause
exit /b %result%
