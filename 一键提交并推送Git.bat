@echo off
setlocal
chcp 65001 >nul
title Mistbound Git Commit and Push
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\git-commit-push.ps1" %*
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" goto failed
echo Completed successfully. Review the full log above.
goto finished

:failed
echo Failed with exit code %EXIT_CODE%. Review the full log above.

:finished
echo Log folder: %~dp0log\git
echo.
pause
exit /b %EXIT_CODE%
