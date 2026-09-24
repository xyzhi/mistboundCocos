$ErrorActionPreference = 'Stop'

$project = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$previewProject = Join-Path $project 'tools\wifi-preview-app'
$gradle = 'E:\tools\Gradle\8.11.1\bin\gradle.bat'
$java = 'E:\tools\JDK\jdk-17.0.20.1+1'
$sdk = 'D:\Program Files\Unity\Editor\2022.3.61f1c1\Editor\Data\PlaybackEngines\AndroidPlayer\SDK'

foreach ($path in @(
    (Join-Path $java 'bin\java.exe'),
    (Join-Path $sdk 'platforms\android-35\android.jar'),
    $gradle,
    (Join-Path $previewProject 'settings.gradle')
)) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Missing WiFi preview build dependency: $path" }
}

$env:JAVA_HOME = $java
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:JAVA_TOOL_OPTIONS = '-Djava.net.preferIPv4Stack=true'

& $gradle -p $previewProject --offline --no-daemon ':app:assembleDebug'
if ($LASTEXITCODE -ne 0) { throw 'WiFi preview APK build failed.' }

$apk = Join-Path $previewProject 'app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path -LiteralPath $apk)) { throw "WiFi preview APK was not generated: $apk" }

$dist = Join-Path $project 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$output = Join-Path $dist 'wifi-preview.apk'
Copy-Item -LiteralPath $apk -Destination $output -Force
Write-Output "WiFi preview APK: $output"
