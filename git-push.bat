@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

cd /d "%~dp0"

set "LOG_DIR=%~dp0git-push-logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%" >nul 2>&1

for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "STAMP=%%I"
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set "NOW=%%I"

set "LOG=%LOG_DIR%\push_%STAMP%.log"
set "REMOTE=origin"

echo ==================================================>>"%LOG%"
echo Git auto commit and push>>"%LOG%"
echo Time: %NOW%>>"%LOG%"
echo Project: %CD%>>"%LOG%"
echo ==================================================>>"%LOG%"

echo.
echo [Git] Project: %CD%
echo [Git] Log: %LOG%
echo.

git rev-parse --is-inside-work-tree >>"%LOG%" 2>&1
if errorlevel 1 goto :not_repo

for /f "delims=" %%I in ('git branch --show-current') do set "BRANCH=%%I"
if not defined BRANCH goto :no_branch

git remote get-url "%REMOTE%" >>"%LOG%" 2>&1
if errorlevel 1 goto :no_remote

echo [1/4] Staging changes...
echo.>>"%LOG%"
echo [1/4] git add -A>>"%LOG%"
git add -A >>"%LOG%" 2>&1
if errorlevel 1 goto :failed

git diff --cached --quiet
if errorlevel 1 (
    if "%~1"=="" (
        for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set "COMMIT_TIME=%%I"
        set "COMMIT_MSG=Auto update !COMMIT_TIME!"
    ) else (
        set "COMMIT_MSG=%*"
    )

    echo [2/4] Committing: !COMMIT_MSG!
    echo.>>"%LOG%"
    echo [2/4] git commit -m "!COMMIT_MSG!">>"%LOG%"
    git commit -m "!COMMIT_MSG!" >>"%LOG%" 2>&1
    if errorlevel 1 goto :failed
) else (
    echo [2/4] No local changes to commit.
    echo.>>"%LOG%"
    echo [2/4] No local changes to commit.>>"%LOG%"
)

echo [3/4] Checking remote...
echo.>>"%LOG%"
echo [3/4] Remote: %REMOTE%, Branch: %BRANCH%>>"%LOG%"
git remote -v >>"%LOG%" 2>&1

echo [4/4] Pushing %BRANCH% to %REMOTE%...
echo.>>"%LOG%"
echo [4/4] git push -u %REMOTE% %BRANCH%>>"%LOG%"
git push -u "%REMOTE%" "%BRANCH%" >>"%LOG%" 2>&1
if errorlevel 1 goto :failed

echo.>>"%LOG%"
echo SUCCESS>>"%LOG%"
echo.
echo ========================================
echo Push completed successfully.
echo Branch: %BRANCH%
echo Log: %LOG%
echo ========================================
echo.
pause
exit /b 0

:not_repo
echo ERROR: This folder is not a Git repository.>>"%LOG%"
echo [ERROR] This folder is not a Git repository.
goto :end_error

:no_branch
echo ERROR: Cannot determine current Git branch.>>"%LOG%"
echo [ERROR] Cannot determine current Git branch.
goto :end_error

:no_remote
echo ERROR: Remote "origin" is not configured.>>"%LOG%"
echo [ERROR] Remote "origin" is not configured.
echo Expected repository: https://github.com/xyzhi/mistboundCocos.git
echo Expected repository: https://github.com/xyzhi/mistboundCocos.git>>"%LOG%"
goto :end_error

:failed
set "EXIT_CODE=%ERRORLEVEL%"
echo.>>"%LOG%"
echo FAILED. Exit code: %EXIT_CODE%>>"%LOG%"
echo.
echo ========================================
echo Git operation failed. Exit code: %EXIT_CODE%
echo Check log for details:
echo %LOG%
echo ========================================
goto :end_error

:end_error
echo.
pause
exit /b 1
