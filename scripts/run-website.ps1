$ErrorActionPreference = "Stop"

$projectRoot = "C:\claude\websitecomponents"
$logDir = Join-Path $projectRoot "logs"
$nextBin = Join-Path $projectRoot "node_modules\next\dist\bin\next"
$port = 3000
$hostAddress = "0.0.0.0"
$lockFile = Join-Path $logDir "website-runner.lock"
$runnerLog = Join-Path $logDir "website-runner.log"
$serverLog = Join-Path $logDir "website-task.log"

if (!(Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

function Write-RunnerLog([string]$message) {
  Add-Content -Path $runnerLog -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $message"
}

function Is-ServerRunning {
  $procs = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'"
  foreach ($proc in $procs) {
    if ($proc.CommandLine -like "*next*start -p $port*") {
      return $true
    }
  }
  return $false
}

function Acquire-LockOrExit {
  if (Test-Path $lockFile) {
    $existingPid = (Get-Content $lockFile -ErrorAction SilentlyContinue | Select-Object -First 1)
    if ($existingPid) {
      $stillRunning = Get-Process -Id ([int]$existingPid) -ErrorAction SilentlyContinue
      if ($stillRunning) {
        Write-RunnerLog "Runner already active (PID $existingPid); exiting duplicate instance."
        exit 0
      }
    }
  }
  Set-Content -Path $lockFile -Value $PID
}

function Ensure-Build {
  if (!(Test-Path (Join-Path $projectRoot ".next\BUILD_ID"))) {
    Write-RunnerLog "Build missing; running next build."
    Push-Location $projectRoot
    try {
      & node $nextBin build *>> $serverLog
      if ($LASTEXITCODE -ne 0) {
        Write-RunnerLog "next build failed with exit code $LASTEXITCODE."
        Start-Sleep -Seconds 15
      }
    }
    finally {
      Pop-Location
    }
  }
}

Acquire-LockOrExit
Write-RunnerLog "Website runner started."

try {
  while ($true) {
    try {
      if (Is-ServerRunning) {
        Write-RunnerLog "Server already running on port $port; sleeping."
        Start-Sleep -Seconds 15
        continue
      }

      Ensure-Build

      Write-RunnerLog "Starting next server on $hostAddress`:$port."
      Push-Location $projectRoot
      try {
        & node $nextBin start -H $hostAddress -p $port *>> $serverLog
        $exitCode = $LASTEXITCODE
      }
      finally {
        Pop-Location
      }

      Write-RunnerLog "Server exited with code $exitCode. Restarting in 5s."
      Start-Sleep -Seconds 5
    }
    catch {
      Write-RunnerLog "Runner loop error: $($_.Exception.Message). Retrying in 10s."
      Start-Sleep -Seconds 10
    }
  }
}
finally {
  if (Test-Path $lockFile) {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
  }
}
