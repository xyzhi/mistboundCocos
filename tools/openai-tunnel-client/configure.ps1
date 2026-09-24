$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$client = Join-Path $root 'tunnel-client.exe'
$privateDir = Join-Path $root 'private'
$profileDir = Join-Path $privateDir 'profiles'
$keyFile = Join-Path $privateDir 'runtime-api-key.txt'
$mcpLauncher = (Join-Path $root 'mcp-stdio.cmd') -replace '\\', '/'

if (-not (Test-Path $client)) { throw "Missing tunnel-client: $client" }

$tunnelId = (Read-Host 'Paste the OpenAI tunnel ID (tunnel_...)').Trim()
if ($tunnelId -notmatch '^tunnel_[A-Za-z0-9_-]+$') { throw 'Invalid tunnel ID.' }

$secureKey = Read-Host 'Paste the runtime API key (input is hidden)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
try {
    $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    if ([string]::IsNullOrWhiteSpace($plainKey)) { throw 'The runtime API key is empty.' }
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    [IO.File]::WriteAllText($keyFile, $plainKey, (New-Object Text.UTF8Encoding($false)))
} finally {
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $plainKey = $null
}

& icacls.exe $privateDir /inheritance:r /grant:r "${env:USERDOMAIN}\${env:USERNAME}:(OI)(CI)F" | Out-Null
& icacls.exe $keyFile /inheritance:r /grant:r "${env:USERDOMAIN}\${env:USERNAME}:F" | Out-Null
$mcpCommand = $mcpLauncher
$env:HTTPS_PROXY = 'http://127.0.0.1:9567'
$env:HTTP_PROXY = 'http://127.0.0.1:9567'
$env:ALL_PROXY = $null
$env:NO_PROXY = 'localhost,127.0.0.1,::1'

& $client runtimes connect `
    --alias mistbound-cocos `
    --profile mistbound-cocos `
    --profile-dir $profileDir `
    --tunnel-id $tunnelId `
    --runtime-api-key "file:$keyFile" `
    --mcp-command $mcpCommand
if ($LASTEXITCODE -ne 0) { throw "tunnel-client connect failed with exit code $LASTEXITCODE" }

& $client runtimes status mistbound-cocos --json
if ($LASTEXITCODE -ne 0) { throw "tunnel-client status failed with exit code $LASTEXITCODE" }

Write-Output ''
Write-Output 'Local setup finished. In ChatGPT Plugins, add a connection of type Tunnel and select this tunnel ID:'
Write-Output $tunnelId
