@echo off
setlocal enabledelayedexpansion
title Sunfyer AI Assistant - Executable Auto-Updater
color 0E

echo =====================================================================
echo           SUNFYER AI ASSISTANT - EXECUTABLE AUTO-UPDATER
echo =====================================================================
echo.
echo Checking environment and preparing to update Sunfyer.exe...
echo.

set "CURRENT_DIR=%~dp0"
set "TARGET_EXE=%CURRENT_DIR%Sunfyer.exe"
set "INSTALL_DIR=%LOCALAPPDATA%\Programs\Sunfyer"
set "SERVER_URL=https://ais-dev-qoe5elwp33znheflu3bcuf-557137885596.europe-west2.run.app/Sunfyer.exe"
set "TEMP_EXE=%TEMP%\Sunfyer_Update_%RANDOM%.exe"

:: If Sunfyer.exe not in current script directory, check common locations
if not exist "%TARGET_EXE%" (
    if exist "%INSTALL_DIR%\Sunfyer.exe" (
        set "TARGET_EXE=%INSTALL_DIR%\Sunfyer.exe"
    ) else if exist "%USERPROFILE%\Desktop\Sunfyer.exe" (
        set "TARGET_EXE=%USERPROFILE%\Desktop\Sunfyer.exe"
    ) else if exist "%USERPROFILE%\Downloads\Sunfyer.exe" (
        set "TARGET_EXE=%USERPROFILE%\Downloads\Sunfyer.exe"
    )
)

echo [1/4] Closing any active Sunfyer instances...
taskkill /F /IM Sunfyer.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/4] Downloading latest Sunfyer.exe payload from server...
echo       Source: %SERVER_URL%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
    "try { " ^
    "    $r = Invoke-WebRequest -Uri '%SERVER_URL%' -OutFile '%TEMP_EXE%' -UseBasicParsing; " ^
    "    $bytes = [IO.File]::ReadAllBytes('%TEMP_EXE%'); " ^
    "    if ($bytes.Length -gt 15000 -and $bytes[0] -eq 77 -and $bytes[1] -eq 90) { exit 0 } else { exit 2 } " ^
    "} catch { exit 1 }"

if errorlevel 2 (
    echo.
    echo [ERROR] Downloaded file is not a valid Windows executable (corrupted response).
    echo Update aborted to protect your existing Sunfyer.exe installation.
    del /f /q "%TEMP_EXE%" >nul 2>&1
    pause
    exit /b 1
)

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to connect to Sunfyer server.
    echo Please verify your internet connection or download manually from:
    echo %SERVER_URL%
    echo.
    pause
    exit /b 1
)

echo.
echo [3/4] Applying verified update to:
echo       %TARGET_EXE%
echo.

:: Backup current executable if it exists
if exist "%TARGET_EXE%" (
    copy /y "%TARGET_EXE%" "%TARGET_EXE%.bak" >nul 2>&1
)

:: Overwrite with new executable
move /y "%TEMP_EXE%" "%TARGET_EXE%" >nul 2>&1
if errorlevel 1 (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Move-Item -Force '%TEMP_EXE%' '%TARGET_EXE%'"
)

echo.
echo =====================================================================
echo    UPDATE SUCCESSFUL! SUNFYER HAS BEEN UPDATED TO THE LATEST BUILD
echo =====================================================================
echo.
echo [4/4] Relaunching Sunfyer...
start "" "%TARGET_EXE%"

echo.
echo Done! You can close this updater window.
timeout /t 3 >nul
exit /b 0
