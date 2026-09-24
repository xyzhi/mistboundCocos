@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   生成 WiFi 真机预览版 APK
echo ========================================
echo.
echo 这个 APK 只需要在手机上安装一次。
echo 安装后，平时改 UI/卡牌/战斗逻辑不需要重新打 APK。
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\build-wifi-preview-apk.ps1"
set "result=%ERRORLEVEL%"
echo.
if not "%result%"=="0" (
  echo [错误] WiFi 预览版 APK 生成失败，错误码：%result%
) else (
  echo [完成] APK 已生成到 dist 目录：
  echo %~dp0dist\wifi-preview.apk
)
echo.
pause
exit /b %result%
