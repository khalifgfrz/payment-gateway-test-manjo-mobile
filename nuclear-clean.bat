@echo off
echo.
echo ============================================
echo NUCLEAR CLEAN - Menghapus semua cache
echo ============================================
echo.

REM Delete node_modules
echo Menghapus node_modules...
if exist node_modules (
  rmdir /s /q node_modules
  echo ✓ node_modules dihapus
) else (
  echo ✓ node_modules tidak ada
)

REM Delete package-lock.json
echo Menghapus package-lock.json...
if exist package-lock.json (
  del /f /q package-lock.json
  echo ✓ package-lock.json dihapus
) else (
  echo ✓ package-lock.json tidak ada
)

REM Clear npm cache
echo Menghapus npm cache...
call npm cache clean --force
echo ✓ npm cache dibersihkan

REM Clear gradle cache (Android)
echo Menghapus Android gradle cache...
if exist android\.gradle (
  rmdir /s /q android\.gradle
  echo ✓ Android gradle cache dihapus
) else (
  echo ✓ Android gradle cache tidak ada
)

REM Delete metro bundler cache
echo Menghapus Metro bundler cache...
if exist %TEMP%\metro-* (
  for /d %%i in (%TEMP%\metro-*) do rmdir /s /q "%%i"
  echo ✓ Metro cache dihapus
) else (
  echo ✓ Metro cache tidak ada
)

REM Reinstall dependencies
echo.
echo ============================================
echo Menginstall dependencies (ini butuh 5-10 menit)
echo ============================================
echo.

call npm install

echo.
echo ============================================
echo ✓ SELESAI! Nuclear clean berhasil
echo ============================================
echo.
echo Langkah selanjutnya:
echo 1. npm start -- --reset-cache
echo 2. npm run android (atau npm run ios)
echo.

pause
