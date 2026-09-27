$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$logDir = Join-Path $projectRoot 'log\git'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$logPath = Join-Path $logDir "push_$stamp.log"
$remote = 'origin'

function Write-Log {
    param([string]$Message = '')
    Write-Host $Message
    Add-Content -LiteralPath $logPath -Value $Message -Encoding UTF8
}

function Invoke-GitLogged {
    param([Parameter(Mandatory)][string[]]$Arguments)
    Write-Log ("> git " + ($Arguments -join ' '))
    $oldErrorActionPreference = $ErrorActionPreference
    try {
        # Windows PowerShell 5 会把原生命令写入 stderr 的普通警告包装成
        # ErrorRecord。这里允许警告继续输出，再根据 Git 的退出码判断成败。
        $ErrorActionPreference = 'Continue'
        & git @Arguments 2>&1 | ForEach-Object {
            $line = $_.ToString()
            Write-Host $line
            Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
        }
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $oldErrorActionPreference
    }
    if ($code -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $code"
    }
}

function Invoke-GitCapture {
    param([Parameter(Mandatory)][string[]]$Arguments)
    $oldErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = @(& git @Arguments 2>&1)
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $oldErrorActionPreference
    }
    if ($code -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $code`n$($output -join [Environment]::NewLine)"
    }
    return $output
}

Set-Location $projectRoot
Write-Log '=================================================='
Write-Log 'Git auto commit and push'
Write-Log ("Time: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
Write-Log "Project: $projectRoot"
Write-Log '=================================================='

try {
    Invoke-GitLogged @('rev-parse', '--is-inside-work-tree')

    $branchOutput = Invoke-GitCapture @('branch', '--show-current')
    $branch = ($branchOutput | Out-String).Trim()
    if ([string]::IsNullOrWhiteSpace($branch)) { throw '无法确定当前 Git 分支。' }
    Write-Log "Branch: $branch"

    Invoke-GitLogged @('remote', 'get-url', $remote)

    Write-Log ''
    Write-Log '[1/4] 正在暂存全部修改……'
    Invoke-GitLogged @('add', '-A')

    & git diff --cached --quiet
    $diffCode = $LASTEXITCODE
    if ($diffCode -eq 1) {
        $changedFiles = @(Invoke-GitCapture @('-c', 'core.quotepath=false', 'diff', '--cached', '--name-only') | Where-Object {
            -not [string]::IsNullOrWhiteSpace($_.ToString())
        })
        $commitMessage = if ($args.Count -gt 0) {
            $args -join ' '
        } else {
            $areas = @($changedFiles | ForEach-Object {
                $path = $_.ToString().Trim('"').Replace('\', '/')
                if ($path.Contains('/')) { $path.Split('/')[0] } else { $path }
            } | Sort-Object -Unique | Select-Object -First 4)
            $areaText = if ($areas.Count -gt 0) { '（' + ($areas -join '、') + '）' } else { '' }
            "自动更新：$($changedFiles.Count) 个文件$areaText " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
        }
        Write-Log ''
        Write-Log "检测到 $($changedFiles.Count) 个已暂存文件。"
        Write-Log "[2/4] 正在提交：$commitMessage"
        # Windows PowerShell 5 向原生命令传递包含空格的非 ASCII 参数时可能拆词。
        # 使用 UTF-8 文件传递提交说明，可完整保留中文、空格和标点。
        $commitMessagePath = Join-Path ([IO.Path]::GetTempPath()) "mistbound_git_commit_$stamp.txt"
        try {
            [IO.File]::WriteAllText($commitMessagePath, $commitMessage, [Text.UTF8Encoding]::new($false))
            Invoke-GitLogged -Arguments @('commit', "--file=$commitMessagePath")
        } finally {
            Remove-Item -LiteralPath $commitMessagePath -Force -ErrorAction SilentlyContinue
        }
    } elseif ($diffCode -eq 0) {
        Write-Log ''
        Write-Log '[2/4] 没有需要提交的本地修改。'
    } else {
        throw "git diff --cached --quiet failed with exit code $diffCode"
    }

    Write-Log ''
    Write-Log '[3/4] 当前远程仓库：'
    Invoke-GitLogged @('remote', '-v')

    Write-Log ''
    Write-Log "[4/4] 正在把 $branch 推送到 $remote……"
    $pushSucceeded = $false
    $lastPushError = $null
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        if ($attempt -gt 1) {
            Write-Log "等待 3 秒后进行第 $attempt 次推送……"
            Start-Sleep -Seconds 3
        }

        try {
            if ($attempt -eq 1) {
                Invoke-GitLogged -Arguments @('push', '-u', $remote, $branch)
            } elseif ($attempt -eq 2) {
                Invoke-GitLogged -Arguments @('-c', 'http.version=HTTP/1.1', 'push', '-u', $remote, $branch)
            } else {
                Write-Log '最后一次尝试将临时绕过代理并使用 HTTP/1.1。'
                $proxyNames = @('ALL_PROXY', 'HTTP_PROXY', 'HTTPS_PROXY', 'GIT_HTTP_PROXY', 'GIT_HTTPS_PROXY')
                $proxyBackup = @{}
                foreach ($proxyName in $proxyNames) {
                    $proxyBackup[$proxyName] = [Environment]::GetEnvironmentVariable($proxyName, 'Process')
                    [Environment]::SetEnvironmentVariable($proxyName, $null, 'Process')
                }
                try {
                    Invoke-GitLogged -Arguments @('-c', 'http.version=HTTP/1.1', '-c', 'http.proxy=', '-c', 'https.proxy=', 'push', '-u', $remote, $branch)
                } finally {
                    foreach ($proxyName in $proxyNames) {
                        [Environment]::SetEnvironmentVariable($proxyName, $proxyBackup[$proxyName], 'Process')
                    }
                }
            }
            $pushSucceeded = $true
            break
        } catch {
            $lastPushError = $_.Exception
            Write-Log "第 $attempt 次推送失败：$($lastPushError.Message)"
        }
    }

    if (-not $pushSucceeded) {
        throw $lastPushError
    }

    Write-Log ''
    Write-Log '================ 推送成功 ================'
    Write-Log "Branch: $branch"
    Write-Log "Log: $logPath"
    exit 0
} catch {
    Write-Log ''
    Write-Log '================ 操作失败 ================'
    Write-Log $_.Exception.Message
    Write-Log "Log: $logPath"
    exit 1
}
