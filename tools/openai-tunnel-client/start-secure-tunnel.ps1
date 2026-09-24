$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$client = Join-Path $root 'tunnel-client.exe'
$profileDir = Join-Path $root 'private\profiles'
$keyFile = Join-Path $root 'private\runtime-api-key.txt'
$mcpLauncher = ((Join-Path $root 'mcp-stdio.cmd') -replace '\\', '/')

# SSRDOG is required on this network to reach api.openai.com.
for ($attempt = 0; $attempt -lt 60; $attempt++) {
    if (Test-NetConnection -ComputerName 127.0.0.1 -Port 9567 -InformationLevel Quiet -WarningAction SilentlyContinue) { break }
    Start-Sleep -Seconds 2
}
$env:HTTPS_PROXY = 'http://127.0.0.1:9567'
$env:HTTP_PROXY = 'http://127.0.0.1:9567'
$env:ALL_PROXY = $null
$env:NO_PROXY = 'localhost,127.0.0.1,::1'

& $client runtimes connect `
    --alias mistbound-cocos `
    --profile mistbound-cocos `
    --profile-dir $profileDir `
    --tunnel-id 'tunnel_6ab0a417b19081919f6904e740ac8560' `
    --runtime-api-key "file:$keyFile" `
    --mcp-command $mcpLauncher
exit $LASTEXITCODE
