# NUCLEAR CLEAN - Solusi Terakhir untuk Error expo-font

## Masalah
Anda punya error: `Unable to resolve module expo-font` meskipun sudah `npm install`

## Penyebab
Cache yang corrupted atau dependency tree yang broken

## Solusi (Nuclear Clean)

### Cara Termudah: Double-Click Script

1. Buka File Explorer
2. Navigasi ke root project Anda
3. Cari file `nuclear-clean.bat`
4. **Double-click** file tersebut
5. Tunggu script selesai (sekitar 10-15 menit total)
6. Window akan menutup otomatis saat selesai

**Done!** ✓

---

## Apa yang Dilakukan Script?

```
1. Menghapus node_modules folder
2. Menghapus package-lock.json  
3. Menghapus npm cache
4. Menghapus Android gradle cache
5. Menghapus Metro bundler cache
6. Reinstall semua dependencies
```

---

## Jika Ingin Manual (Tidak Menggunakan Script)

Buka PowerShell atau Git Bash dan jalankan satu per satu:

```powershell
# 1. Hapus node_modules
rmdir /s /q node_modules

# 2. Hapus package-lock.json
del package-lock.json

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Reset Metro cache saat start
npm start -- --reset-cache

# 6. Di terminal lain, jalankan app
npm run android
```

---

## Verifikasi

Setelah selesai, jalankan:

```bash
npm list expo-font
```

Harusnya muncul:
```
payment-gateway-project-mobile@0.0.1
└── expo-font@11.10.0
```

Bukan `(empty)` ✓

---

## Step-by-Step untuk Menjalankan Script

### Jika menggunakan VS Code:

1. Tekan `Ctrl + Shift + P`
2. Ketik: `Terminal: New Terminal`
3. Di terminal ketik:
   ```bash
   .\nuclear-clean.bat
   ```
4. Tekan Enter
5. Tunggu sampai selesai

### Jika menggunakan File Explorer:

1. Buka File Explorer (`Windows + E`)
2. Navigasi ke folder project Anda
3. Cari `nuclear-clean.bat`
4. Double-click
5. Tunggu sampai selesai

---

## Troubleshooting

### Script tidak bisa dijalankan?
- Pastikan Anda sudah di folder project yang benar
- Coba jalankan dari VS Code terminal (lebih reliable)

### Still getting error setelah nuclear clean?
Hubungi support atau coba:
```bash
npm install expo-font --save --force
```

---

## Waktu Tunggu

- Cleanup: 2-3 menit
- npm install: 5-10 menit
- **Total: 10-15 menit**

Jangan tutup window sampai selesai!

---

**Rekomendasi:** Gunakan script ini jika masih error setelah `npm install` biasa.
