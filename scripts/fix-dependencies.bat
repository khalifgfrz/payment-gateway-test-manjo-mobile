@echo off
REM React Native 0.73 Dependency Fix Script for Windows

setlocal enabledelayedexpansion

echo.
echo ===== React Native 0.73 Dependency Fix Script =====
echo.

REM Step 1: Remove node_modules
echo [Step 1] Removing node_modules...
if exist "node_modules" (
    rmdir /s /q node_modules
    echo OK - node_modules removed
) else (
    echo OK - node_modules not found
)
echo.

REM Step 2: Clear npm cache
echo [Step 2] Clearing npm cache...
call npm cache clean --force
echo OK - npm cache cleared
echo.

REM Step 3: Clear Metro cache
echo [Step 3] Clearing Metro bundler cache...
if exist "node_modules\.cache" (
    rmdir /s /q node_modules\.cache
    echo OK - Metro cache cleared
) else (
    echo OK - Metro cache not found
)
echo.

REM Step 4: Reinstall dependencies
echo [Step 4] Reinstalling npm packages...
call npm install
echo OK - Dependencies installed
echo.

REM Step 5: Install Expo dependencies
echo [Step 5] Ensuring Expo dependencies are installed...
call npm install expo-font @expo/vector-icons --save
echo OK - Expo dependencies verified
echo.

echo ===== Fix Complete! =====
echo.
echo Next steps:
echo 1. If on iOS: cd ios ^&^& pod install ^&^& cd ..
echo 2. Run: npm start -- --reset-cache
echo 3. Press 'i' for iOS or 'a' for Android
echo.
echo Common issues:
echo - If error persists, try: npm start -- --reset-cache --verbose
echo - Clear app cache on device
echo - Restart development server
echo.
pause
