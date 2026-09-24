@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo [Mistbound] 正在安装游戏依赖...
call npm --prefix game ci
if errorlevel 1 (
  echo.
  echo [错误] 游戏依赖安装失败。
  echo 请确认已安装 Node.js 20.19 或更高版本，并且 npm 可以正常访问软件源。
  pause
  exit /b 1
)

echo.
echo [Mistbound] 游戏依赖已经安装完成。
pause
