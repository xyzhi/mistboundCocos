# Compatibility entry point; prefer double-clicking build-generic.bat.
$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'build-channel-apk.ps1') -Channel Generic
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
