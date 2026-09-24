@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   下一站，晚安 - WiFi 真机实时预览
echo ========================================
echo.
echo 正在启动实时预览服务器...
echo 修改 game\src 下的代码并保存后，手机会自动刷新/热更新。
echo.
node tools\serve-wifi-game.mjs
if errorlevel 1 (
  echo.
  echo [错误] WiFi 真机预览启动失败。
  echo 如果提示缺少依赖，请先双击“初始化游戏依赖.bat”。
  pause
  exit /b 1
)
