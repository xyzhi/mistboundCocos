# Compatibility entry point; prefer double-clicking 通用版打包.bat.
$ErrorActionPreference = 'Stop'
$project = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$logDir = Join-Path $project 'log\build'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$logFile = Join-Path $logDir ("build-generic-{0}.log" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
& (Join-Path $PSScriptRoot 'build-channel-apk.ps1') -Channel Generic -LogFile $logFile
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
