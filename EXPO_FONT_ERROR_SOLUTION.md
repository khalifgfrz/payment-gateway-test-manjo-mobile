# Solusi Error: "Unable to resolve module expo-font"

## Status Error Anda
```
Error: Unable to resolve module expo-font
Module does not exist in the Haste module map or in these directories:
  \node_modules\@expo\vector
  
Metro resolver could not find: expo-font
```

Ini adalah error **dependency missing** yang sering terjadi di React Native/Expo projects.

---

## Solusi Cepat (Langsung Kerja)

### Pilihan 1: Gunakan Script Otomatis (Recommended)

**Windows (Command Prompt atau PowerShell):**
```bash
cd D:\Project\PaymentGatewayProjectMobile
.\scripts\fix-dependencies.bat
```

**macOS/Linux:**
```bash
cd /path/to/PaymentGatewayProjectMobile
bash scripts/fix-dependencies.sh
chmod +x scripts/fix-dependencies.sh  # Jika perlu
bash scripts/fix-dependencies.sh
```

Script ini akan:
1. Menghapus `node_modules` yang corrupted
2. Clear npm cache
3. Clear Metro bundler cache
4. Reinstall semua dependencies
5. Eksplisit install `expo-font` dan `@expo/vector-icons`

### Pilihan 2: Manual Fix (3 Langkah)

```bash
# Langkah 1: Hapus node_modules dan lock file
rm -rf node_modules package-lock.json          # macOS/Linux
rmdir /s /q node_modules & del package-lock.json  # Windows

# Langkah 2: Clear semua cache
npm cache clean --force

# Langkah 3: Reinstall dengan reset cache
npm install
npm install expo-font --save
npm start -- --reset-cache
```

---

## Verifikasi Fix Berhasil

Setelah menjalankan fix, verifikasi:

```bash
# Check 1: Pastikan expo-font terinstall
npm list expo-font
# Harus output seperti:
# └── expo-font@11.10.0

# Check 2: Pastikan @expo/vector-icons ada
npm list @expo/vector-icons
# Harus output seperti:
# └── @expo/vector-icons@13.0.0

# Check 3: Verifikasi folder ada
# Windows: dir node_modules | find "expo-font"
# macOS/Linux: ls node_modules | grep expo-font
# Harus ada folder bernama "expo-font"

# Check 4: Test aplikasi
npm start -- --reset-cache
# Tunggu Metro bundler selesai compile
# Jangan tutup terminal ini
# Di terminal lain: npm run ios  atau  npm run android
```

---

## Penjelasan Teknis

### Mengapa Error Ini Terjadi?

```
@expo/vector-icons membutuhkan expo-font sebagai peer dependency
  ↓
Jika expo-font tidak terinstall, Metro bundler tidak bisa resolve module
  ↓
Error: "Unable to resolve module expo-font"
```

### Kapan Error Ini Terjadi?

1. **Fresh Clone:** Setelah git clone, belum run `npm install`
2. **Corrupted node_modules:** Instalasi tidak lengkap
3. **Package Lock Mismatch:** `package-lock.json` tidak sinkron
4. **Metro Cache:** Cache lama yang refer ke file yang tidak ada
5. **Partial Installation:** `npm install` terganggu di tengah

---

## Checklist untuk Menghindari Error

### Saat Clone Project Pertama Kali
```bash
✓ git clone <repo>
✓ cd project-directory
✓ npm install              # JANGAN SKIP!
✓ npm install expo-font --save  # Eksplisit
✓ npm start -- --reset-cache
```

### Saat Sebelum Commit
```bash
✓ npm list                 # Verifikasi semua deps ada
✓ npm audit                # Check security issues
✓ npm test                 # Run tests
✓ npm start -- --reset-cache  # Fresh build
```

### Saat Switching Branch
```bash
✓ git switch <branch>
✓ git pull origin <branch>
✓ npm install              # Dependencies mungkin berbeda di branch lain
✓ npm start -- --reset-cache
```

---

## Common Mistakes yang Harus Dihindari

❌ **SALAH:**
```bash
npm start              # Tanpa clear cache
# Result: Metro bundler menggunakan cache lama
```

✅ **BENAR:**
```bash
npm start -- --reset-cache  # Dengan clear cache
# Result: Metro bundler compile fresh
```

---

❌ **SALAH:**
```bash
npm install package-name    # Tanpa --save
# Result: tidak disimpan di package.json
```

✅ **BENAR:**
```bash
npm install expo-font --save   # Dengan --save
# Result: disimpan di package.json untuk reproduksi nanti
```

---

❌ **SALAH:**
```bash
git pull && npm start       # Langsung run
# Result: Mungkin ada dependencies baru yang belum ter-install
```

✅ **BENAR:**
```bash
git pull && npm install && npm start -- --reset-cache
# Result: Semua dependencies fresh, Metro cache fresh
```

---

## Debugging Jika Masih Error

### Step 1: Verifikasi Node.js Version
```bash
node --version
npm --version
```

**Requirements:**
- Node.js: 18.0.0 atau lebih tinggi
- npm: 8.0.0 atau lebih tinggi

Jika tidak sesuai, [download Node.js LTS](https://nodejs.org)

### Step 2: Check file expo-font
```bash
# Windows
dir node_modules\expo-font

# macOS/Linux
ls -la node_modules/expo-font
```

Harus ada folder dengan file-file di dalamnya.

### Step 3: Verbose Output
```bash
npm start -- --reset-cache --verbose

# Akan output banyak debug info
# Cari line yang mention "expo-font"
# Jika masih error, copy verbose output untuk debugging
```

### Step 4: Nuclear Option
```bash
# Delete EVERYTHING dan start fresh
rm -rf node_modules ios/Pods build .expo .next
npm cache clean --force
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache --verbose
```

---

## Metro Bundler Lifecycle

Ini adalah flow yang terjadi saat `npm start`:

```
npm start
  ↓
Check package.json → List semua dependencies
  ↓
Check node_modules → Verifikasi semua packages ada
  ↓
Load Metro bundler
  ↓
Build dependency graph → Resolve semua imports
  ↓
Detect module expo-font dari @expo/vector-icons
  ↓
Look in node_modules/expo-font → FOUND ✓
  ↓
Compile application
  ↓
Metro Bundler ready ✓
```

Jika step "Look in node_modules/expo-font" tidak menemukan file, error terjadi.

---

## File Structure yang Benar

Setelah fix berhasil, structure node_modules harus seperti ini:

```
node_modules/
├── expo-font/                    ← HARUS ADA
│   ├── package.json
│   ├── build/
│   ├── src/
│   └── ...
├── @expo/
│   ├── vector-icons/             ← HARUS ADA
│   │   ├── package.json
│   │   ├── build/
│   │   └── fonts/
│   └── ...
├── react-native/
├── @react-navigation/
└── ... (other packages)
```

---

## Environment Variables

Pastikan `.env` sudah setup:

```bash
# Copy template
cp .env.example .env

# Buka .env dan fill dengan config Anda
# File sudah ada di root project
```

---

## Verifikasi Lengkap (Post-Fix)

Setelah menjalankan fix, run ini untuk verifikasi:

```bash
echo "=== Node Environment ==="
node --version
npm --version

echo "=== Check Dependencies ==="
npm list expo-font
npm list @expo/vector-icons
npm list react-native

echo "=== Start Metro Bundler ==="
npm start -- --reset-cache

# Jangan close terminal ini!
# Di terminal baru, run:
npm run ios    # atau npm run android
```

Jika tidak ada error dan aplikasi muncul, berarti fix 100% berhasil!

---

## Reference Links

- [Expo Font Documentation](https://docs.expo.dev/guides/using-custom-fonts/)
- [Expo Vector Icons](https://icons.expo.fyi/)
- [Metro Bundler Docs](https://facebook.github.io/metro/)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)

---

## Kesimpulan

Jika Anda melihat error `"Unable to resolve module expo-font"`:

1. Jalankan script fix otomatis: `.\scripts\fix-dependencies.bat` (Windows) atau `bash scripts/fix-dependencies.sh` (Mac/Linux)
2. Tunggu sampai selesai
3. Jalankan `npm start -- --reset-cache`
4. Aplikasi sekarang harus berjalan normal!

**Time to fix: 2-5 menit**

Jika masih bermasalah, lihat [ERROR_FIX_GUIDE.md](./ERROR_FIX_GUIDE.md) untuk step-by-step yang lebih detail.
