@echo off
setlocal

set "PROJECT_ROOT=C:\claude\websitecomponents"
set "LOG_DIR=%PROJECT_ROOT%\logs"
set "NEXT_BIN=%PROJECT_ROOT%\node_modules\next\dist\bin\next"
set "PORT=3000"
set "HOST=0.0.0.0"

if not exist "%LOG_DIR%" (
  mkdir "%LOG_DIR%"
)

cd /d "%PROJECT_ROOT%"

if not exist ".next\BUILD_ID" (
  echo [%date% %time%] Build missing. Running next build...>>"%LOG_DIR%\website-task.log"
  node "%NEXT_BIN%" build >>"%LOG_DIR%\website-task.log" 2>&1
  if errorlevel 1 (
    echo [%date% %time%] Build failed. Exiting.>>"%LOG_DIR%\website-task.log"
    exit /b 1
  )
)

echo [%date% %time%] Starting website on %HOST%:%PORT%...>>"%LOG_DIR%\website-task.log"
node "%NEXT_BIN%" start -H %HOST% -p %PORT% >>"%LOG_DIR%\website-task.log" 2>&1
