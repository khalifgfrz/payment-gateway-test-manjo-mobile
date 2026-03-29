# Cara Menjalankan fix-dependencies.bat

## Metode 1: Double Click (Paling Mudah)

1. Buka File Explorer
2. Navigate ke folder project Anda: `D:\Project\PaymentGatewayProjectMobile` (atau folder mana pun Anda simpan)
3. Buka folder `scripts`
4. Cari file `fix-dependencies.bat`
5. **Double click** file `fix-dependencies.bat`
6. Tunggu proses selesai (akan ada Command Prompt yang terbuka)
7. Tekan Enter atau tutup window ketika selesai

---

## Metode 2: Command Prompt (CMD)

### Step 1: Buka Command Prompt
- Tekan `Win + R` di keyboard
- Ketik: `cmd`
- Tekan Enter

### Step 2: Navigate ke folder project
```bash
cd D:\Project\PaymentGatewayProjectMobile
```
*(Sesuaikan path dengan folder Anda)*

### Step 3: Jalankan script
```bash
.\scripts\fix-dependencies.bat
```

### Step 4: Tunggu hingga selesai
- Script akan otomatis:
  1. Menghapus node_modules
  2. Clear npm cache
  3. Reinstall semua dependencies
  4. Reset Metro cache

---

## Metode 3: PowerShell

### Step 1: Buka PowerShell
- Tekan `Win + X`
- Pilih "Windows PowerShell" atau "Windows Terminal"

### Step 2: Navigate ke folder project
```powershell
cd D:\Project\PaymentGatewayProjectMobile
```

### Step 3: Jalankan script
```powershell
.\scripts\fix-dependencies.bat
```

---

## Metode 4: Dari VS Code (Recommended)

### Step 1: Buka project di VS Code
- Buka folder project di VS Code

### Step 2: Buka Terminal
- Tekan `Ctrl + `` (backtick/grave accent)
- Atau: Menu → Terminal → New Terminal

### Step 3: Jalankan script
```bash
.\scripts\fix-dependencies.bat
```

### Step 4: Tunggu selesai
- Terminal akan menampilkan progress
- Tunggu sampai semua selesai (biasanya 5-10 menit)

---

## Apa yang Akan Dilakukan Script?

Script `fix-dependencies.bat` akan melakukan:

1. **Hapus node_modules folder** (folder yang berisi semua dependencies)
   ```
   ✓ Menghapus folder lama yang mungkin corrupt
   ```

2. **Clear npm cache**
   ```
   ✓ Membersihkan cache agar fresh install
   ```

3. **Reinstall dependencies**
   ```
   ✓ Menginstall ulang semua packages dengan benar
   ```

4. **Verifikasi expo-font**
   ```
   ✓ Memastikan expo-font terinstall dengan benar
   ```

5. **Reset Metro cache**
   ```
   ✓ Membersihkan Metro bundler cache
   ```

---

## Checklist Setelah Menjalankan Script

Setelah script selesai, verifikasi dengan:

```bash
# Terminal baru, di folder project:
npm list expo-font
```

Seharusnya output seperti ini:
```
├── expo-font@11.10.0
└── @expo/vector-icons@14.0.4
```

Jika muncul dengan version numbers, berarti berhasil ✓

---

## Jika Ada Error Saat Script Jalan

### Error: "Cannot find node or npm"
- Pastikan Anda sudah install Node.js
- Download di: https://nodejs.org/ (LTS version)
- Restart Command Prompt setelah install

### Error: "Access is denied"
- Buka Command Prompt sebagai Administrator
  1. Tekan `Win + R`
  2. Ketik `cmd`
  3. Tekan `Ctrl + Shift + Enter` (bukan hanya Enter)

### Proses tergantung/hang
- Tekan `Ctrl + C` untuk stop
- Jalankan ulang: `npm install` saja
- Atau gunakan Emergency Fix (lihat di bawah)

---

## Emergency Fix (Jika Script Gagal)

Jalankan command ini satu per satu:

```bash
rmdir /s /q node_modules
npm cache clean --force
npm install
npm install expo-font @expo/vector-icons --save
npm start -- --reset-cache
```

---

## Setelah Semua Selesai

### Jalankan Metro Bundler
```bash
npm start
```

### Terminal Baru - Jalankan App
```bash
# For iOS:
npm run ios

# For Android:
npm run android
```

---

## Summary

| Metode | Kemudahan | Kecepatan | Rekomendasi |
|--------|-----------|-----------|-------------|
| Double Click | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✓ Paling mudah |
| CMD | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✓ Standard |
| PowerShell | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✓ Modern |
| VS Code | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✓ Best for dev |

---

Pilih salah satu metode di atas yang paling nyaman untuk Anda!
