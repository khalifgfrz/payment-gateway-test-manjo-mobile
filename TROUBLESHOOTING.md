# Troubleshooting Guide - React Native 0.73 Payment Gateway

## Common Issues & Solutions

### 1. ❌ Error: "Cannot find module 'react-native-safe-area-context'"

**Penyebab:** Package belum terinstall atau versi tidak match dengan React Native 0.73

**Solusi:**
```bash
npm install
# atau jika menggunakan yarn
yarn install

# Jika masih error, hapus node_modules dan lock file:
rm -rf node_modules package-lock.json
npm install
```

---

### 2. ❌ Error: "Gagal memuat transaksi. Pastikan server berjalan di localhost:8080"

**Penyebab:** Backend API server tidak berjalan atau tidak accessible

**Solusi:**
```bash
# Terminal 1: Jalankan React Native app
npm start

# Terminal 2: Pastikan backend server berjalan
# Contoh jika menggunakan Node.js backend:
cd ../backend
npm start
# Backend harus running di http://localhost:8080

# Verifikasi dengan curl:
curl http://localhost:8080/api/v1/transactions?page=1&limit=10
```

---

### 3. ❌ Error: Metro Bundler Cache Issue

**Solusi:**
```bash
# Clear cache dan restart bundler
npm start -- --reset-cache

# Atau manual clear:
watchman watch-del-all
npm start
```

---

### 4. ❌ Red Screen dengan Error: "ReferenceError: Can't find variable: SafeAreaView"

**Penyebab:** Import SafeAreaView masih dari 'react-native'

**Verifikasi:** Check `/vercel/share/v0-project/App.tsx` line 1-7 harus seperti ini:
```typescript
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
```

---

### 5. ❌ iOS Build Error

**Solusi:**
```bash
# Clean iOS build folder
cd ios && rm -rf Pods Podfile.lock build && cd ..

# Reinstall pods
cd ios && pod install && cd ..

# Run iOS
npm run ios
```

---

### 6. ❌ Android Build Error

**Solusi:**
```bash
# Clear gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm run android
```

---

### 7. ❌ Error: "Cannot read property 'data' of undefined" di HomeScreen

**Penyebab:** API response structure tidak sesuai dengan interface yang didefinisikan

**Solusi:**
```bash
# Pastikan backend mengembalikan response dengan format:
{
  "data": [
    {
      "id": "...",
      "merchant_id": "...",
      "amount": "...",
      "trx_id": "...",
      "reference_no": "...",
      "status": "...",
      "transaction_date": "..."
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

---

### 8. ❌ QR Code tidak bisa di-download/share

**Solusi:**
```bash
# Install native modules yang mungkin hilang
npm install react-native-share --save
npm install react-native-qrcode-svg --save

# Untuk iOS:
cd ios && pod install && cd ..

# Untuk Android:
cd android && ./gradlew clean && cd ..
```

---

### 9. ❌ "react-native-safe-area-context" tidak ada di package.json

**Solusi:**
```bash
npm install react-native-safe-area-context@4.8.2
```

Pastikan di package.json sudah ada:
```json
"react-native-safe-area-context": "^4.8.2"
```

---

### 10. ❌ White Screen on Startup

**Troubleshooting steps:**

1. Check Metro Bundler output di terminal
```bash
npm start
# Lihat output apakah ada error saat compile
```

2. Verify App.tsx structure
```bash
# Pastikan App.tsx structure valid:
grep -n "export default function App" /vercel/share/v0-project/App.tsx
```

3. Check index.js
```bash
# Pastikan index.js mengimport App.tsx dengan benar
cat /vercel/share/v0-project/index.js
```

---

## Verification Checklist

Sebelum menjalankan app, pastikan:

- [ ] Semua dependencies terinstall: `npm install`
- [ ] React Native version 0.73.0: `npm list react-native`
- [ ] SafeAreaView import dari `react-native-safe-area-context`
- [ ] Backend server berjalan di `localhost:8080`
- [ ] Network access ke API tidak diblok firewall
- [ ] No console errors saat startup

---

## Testing API Endpoints

Gunakan curl atau Postman untuk test setiap endpoint:

```bash
# Get transactions
curl -X GET http://localhost:8080/api/v1/transactions?page=1&limit=10

# Generate signature
curl -X POST http://localhost:8080/api/v1/signature \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","originalReferenceNo":"REF001","amountValue":"100000"}'

# Generate QR Code
curl -X POST http://localhost:8080/api/v1/qr/generate \
  -H "Content-Type: application/json" \
  -H "X-SIGNATURE: your-signature" \
  -d '{
    "partnerReferenceNo":"PRN-2024-001",
    "merchantId":"MERCHANT123",
    "trx_id":"TRX-2024-001",
    "amount":{"value":"100000","currency":"IDR"}
  }'

# Process payment
curl -X POST http://localhost:8080/api/v1/qr/payment \
  -H "Content-Type: application/json" \
  -H "X-SIGNATURE: your-signature" \
  -d '{
    "originalReferenceNo":"REF001",
    "transactionStatusDesc":"SUCCESS",
    "paidTime":"2024-01-01T10:00:00Z",
    "amount":{"value":"100000","currency":"IDR"}
  }'

# Track transaction
curl -X GET http://localhost:8080/api/v1/tracker/REF001
```

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start Metro Bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run linter
npm run lint

# Run tests
npm run test

# Clear all caches
npm start -- --reset-cache && watchman watch-del-all
```

---

## Logs & Debugging

**Check Metro Bundler logs:**
```bash
npm start
# Lihat output terminal, cari WARNING atau ERROR
```

**Check Android logs:**
```bash
adb logcat | grep ReactNative
```

**Check iOS logs:**
```bash
# Di Xcode: Product > Scheme > Edit Scheme > Run > Pre-actions > Add script:
# Atau check Console.app di Mac
```

**Add debug logs di code:**
```typescript
console.log('[DEBUG]', 'Variable value:', someVariable);
```

---

## Performance Tips

1. **Optimize FlatList rendering:**
   - HomeScreen sudah menggunakan FlatList dengan proper `keyExtractor`
   - Avoid inline function di `renderItem`

2. **Avoid unnecessary re-renders:**
   - Aplikasi sudah menggunakan functional components dengan hooks
   - Gunakan `useMemo` dan `useCallback` jika diperlukan

3. **Optimize API calls:**
   - Implement caching strategy di axios interceptors
   - Gunakan pagination (sudah implemented di HomeScreen)

---

## Support & Resources

- **React Native Docs:** https://reactnative.dev
- **React Navigation Docs:** https://reactnavigation.org
- **Axios Docs:** https://axios-http.com
- **Expo Vector Icons:** https://icons.expo.fyi

---

**Last Updated:** 2024
**React Native Version:** 0.73.0
**Status:** ✅ Compatible
