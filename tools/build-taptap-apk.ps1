# Compatibility entry point; prefer double-clicking TapTap版打包.bat.
$ErrorActionPreference = 'Stop'
$project = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$logDir = Join-Path $project 'log\build'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$logFile = Join-Path $logDir ("build-taptap-{0}.log" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
& (Join-Path $PSScriptRoot 'build-channel-apk.ps1') -Channel TapTap -LogFile $logFile
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
