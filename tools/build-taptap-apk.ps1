# Compatibility entry point; prefer double-clicking build-taptap.bat.
$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'build-channel-apk.ps1') -Channel TapTap
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
