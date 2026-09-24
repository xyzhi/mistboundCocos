param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('TapTap', 'Generic')]
    [string]$Channel,
    [string]$LogFile
)

$ErrorActionPreference = 'Stop'
$project = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$channelNameForLog = $Channel.ToLowerInvariant()
if (-not $LogFile) {
    $defaultLogDir = Join-Path $project 'log\build'
    New-Item -ItemType Directory -Path $defaultLogDir -Force | Out-Null
    $LogFile = Join-Path $defaultLogDir ("build-{0}-{1}.log" -f $channelNameForLog, (Get-Date -Format 'yyyyMMdd_HHmmss'))
}
$transcriptStarted = $false
if ($LogFile) {
    $logDirectory = Split-Path -Parent $LogFile
    if ($logDirectory) {
        New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    }
    Start-Transcript -LiteralPath $LogFile -Force | Out-Null
    $transcriptStarted = $true
}

try {
$gradleProject = Join-Path $project 'build\android-debug\proj'
$java = 'E:\tools\JDK\jdk-17.0.20.1+1'
$sdk = 'D:\Program Files\Unity\Editor\2022.3.61f1c1\Editor\Data\PlaybackEngines\AndroidPlayer\SDK'
$gradle = 'E:\tools\Gradle\8.11.1\bin\gradle.bat'
$ninja = 'E:\tools\Ninja\1.11.1'

foreach ($path in @((Join-Path $java 'bin\java.exe'),
        (Join-Path $sdk 'build-tools\34.0.0\aapt.exe'),
        (Join-Path $sdk 'build-tools\34.0.0\apksigner.bat'),
        (Join-Path $gradleProject 'settings.gradle'), $gradle,
        (Join-Path $ninja 'ninja.exe'))) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Missing build dependency: $path" }
}

$properties = Get-Content -LiteralPath (Join-Path $gradleProject 'gradle.properties') -Raw
$nativeDir = [regex]::Match($properties, '(?m)^NATIVE_DIR=(.+)$').Groups[1].Value.Trim()
$expectedNativeDir = (Join-Path $project 'native\engine\android').Replace('\', '/')
if ($nativeDir.Replace('\', '/') -ne $expectedNativeDir) {
    throw 'The exported Cocos Android project points to another workspace. Re-export Android from Cocos Creator first.'
}

$signingDir = Join-Path $project 'signing'
$keystore = Join-Path $signingDir 'next-stop-goodnight.jks'
$credentialsPath = Join-Path $signingDir 'credentials.json'
if (-not (Test-Path -LiteralPath $keystore) -or -not (Test-Path -LiteralPath $credentialsPath)) {
    throw 'The existing release signing key or credentials are missing; restore both before packaging.'
}
$credentials = Get-Content -LiteralPath $credentialsPath -Raw | ConvertFrom-Json
if (-not $credentials.alias -or -not $credentials.password) { throw 'Invalid signing credentials.' }

if ($Channel -eq 'TapTap' -and (-not $env:TAPTAP_CLIENT_ID -or -not $env:TAPTAP_CLIENT_TOKEN)) {
    $localConfig = Join-Path $signingDir 'taptap-client.json'
    if (Test-Path -LiteralPath $localConfig) {
        $config = Get-Content -LiteralPath $localConfig -Raw | ConvertFrom-Json
        $env:TAPTAP_CLIENT_ID = $config.clientId
        $env:TAPTAP_CLIENT_TOKEN = $config.clientToken
    } else {
        # Existing builds keep the credentials in generated BuildConfig. This is a
        # compatibility fallback for this machine, not a source-controlled secret.
        $previous = Join-Path $gradleProject 'build\CocosGame\generated\source\buildConfig\taptap\release\com\xyzhi\nextstopgoodnight\BuildConfig.java'
        if (-not (Test-Path -LiteralPath $previous)) {
            $previous = Join-Path $gradleProject 'build\CocosGame\generated\source\buildConfig\release\com\xyzhi\nextstopgoodnight\BuildConfig.java'
        }
        if (Test-Path -LiteralPath $previous) {
            $text = Get-Content -LiteralPath $previous -Raw
            $env:TAPTAP_CLIENT_ID = [regex]::Match($text, 'TAPTAP_CLIENT_ID\s*=\s*"([^"]+)"').Groups[1].Value
            $env:TAPTAP_CLIENT_TOKEN = [regex]::Match($text, 'TAPTAP_CLIENT_TOKEN\s*=\s*"([^"]+)"').Groups[1].Value
        }
    }
}
if ($Channel -eq 'TapTap' -and (-not $env:TAPTAP_CLIENT_ID -or -not $env:TAPTAP_CLIENT_TOKEN)) {
    throw 'Set TAPTAP_CLIENT_ID and TAPTAP_CLIENT_TOKEN, or add ignored signing\taptap-client.json.'
}

$env:GAME_RELEASE_STORE_FILE = $keystore
$env:GAME_RELEASE_STORE_PASSWORD = $credentials.password
$env:GAME_RELEASE_KEY_ALIAS = $credentials.alias
$env:GAME_RELEASE_KEY_PASSWORD = $credentials.password
$env:JAVA_HOME = $java
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:JAVA_TOOL_OPTIONS = '-Djava.net.preferIPv4Stack=true'
$env:PATH = $ninja + ';' + $env:PATH

$viteEntry = Join-Path $project 'game\node_modules\vite\dist\node\index.js'
$sharpEntry = Join-Path $project 'game\node_modules\sharp\lib\index.js'
if (!(Test-Path $viteEntry) -or !(Test-Path $sharpEntry)) {
    throw 'Missing game Node dependencies. Run 初始化游戏依赖.bat once before building the APK.'
}

Push-Location $project
try {
    $webBuildArguments = @('tools/build-original-web.mjs')
    if ($Channel -eq 'TapTap') { $webBuildArguments += '--disable-cheats' }
    & node @webBuildArguments
    if ($LASTEXITCODE -ne 0) { throw 'Web game build failed.' }
    & node tools/build-android-icons.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Android icon build failed.' }
} finally {
    Pop-Location
}

$task = ":CocosGame:assemble${Channel}Release"
Push-Location $gradleProject
try {
    & $gradle --no-daemon $task
    if ($LASTEXITCODE -ne 0) { throw "Gradle build failed: $task" }
} finally {
    Pop-Location
}

$channelName = $Channel.ToLowerInvariant()
$apkDir = Join-Path $gradleProject "build\CocosGame\outputs\apk\$channelName\release"
$apks = @(Get-ChildItem -LiteralPath $apkDir -Filter '*.apk' -File)
if ($apks.Count -ne 1) { throw "Expected one $Channel release APK in $apkDir, found $($apks.Count)." }
$dist = Join-Path $project 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$output = Join-Path $dist "next-stop-goodnight-$channelName-$stamp.apk"
Copy-Item -LiteralPath $apks[0].FullName -Destination $output

$aapt = Join-Path $sdk 'build-tools\34.0.0\aapt.exe'
$apksigner = Join-Path $sdk 'build-tools\34.0.0\apksigner.bat'
$package = (& $aapt dump badging $output | Select-String '^package:').Line
if ($LASTEXITCODE -ne 0 -or -not $package) { throw 'Could not inspect APK package information.' }
$signer = (& $apksigner verify --print-certs $output | Select-String 'Signer #1 certificate MD5 digest').Line
if ($LASTEXITCODE -ne 0 -or -not $signer) { throw 'APK signature verification failed.' }
Write-Output "APK: $output"
Write-Output "SHA-256: $((Get-FileHash -LiteralPath $output -Algorithm SHA256).Hash)"
Write-Output $package
Write-Output $signer
if ($Channel -eq 'Generic') {
    Write-Warning 'Generic APK has no TapTap login or anti-addiction. Do not submit it to TapTap or another store requiring those services.'
}
} finally {
    if ($transcriptStarted) {
        Stop-Transcript | Out-Null
    }
}
