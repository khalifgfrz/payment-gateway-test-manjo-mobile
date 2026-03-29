# React Native 0.73 Compatibility Fixes

## Perubahan yang Telah Dilakukan

### 1. App.tsx - Import SafeAreaView
**Masalah:** SafeAreaView diimport dari `react-native` yang deprecated di React Native 0.73
**Solusi:** Mengubah import dari `react-native-safe-area-context`

```typescript
// Sebelum:
import { SafeAreaView } from 'react-native';

// Sesudah:
import { SafeAreaView } from 'react-native-safe-area-context';
```

### 2. App.tsx - Menghapus StatusBar API
**Masalah:** `StatusBar.setBarStyle()` tidak lagi direkomendasikan di React Native 0.73
**Solusi:** Menghapus useEffect yang mengatur StatusBar

```typescript
// Dihapus:
useEffect(() => {
  StatusBar.setBarStyle('light-content');
}, []);
```

## Versi Dependencies

Aplikasi ini menggunakan:
- **React Native:** 0.73.0
- **React:** 18.2.0
- **@react-navigation/native:** ^6.1.18
- **@react-navigation/bottom-tabs:** ^6.6.1
- **react-native-safe-area-context:** ^4.8.2
- **@expo/vector-icons:** ^13.0.0

## Langkah-langkah Setup

1. **Instalasi Dependencies:**
   ```bash
   npm install
   # atau
   yarn install
   ```

2. **Jalankan untuk iOS:**
   ```bash
   npm run ios
   ```

3. **Jalankan untuk Android:**
   ```bash
   npm run android
   ```

4. **Start Metro Bundler:**
   ```bash
   npm start
   ```

## API Configuration

API endpoint dikonfigurasi di `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**Sebelum menjalankan aplikasi, pastikan backend server berjalan di `localhost:8080`**

## Struktur Project

```
├── App.tsx                          # Entry point utama
├── index.js                         # Registrasi app
├── src/
│   ├── screens/                     # Semua screen aplikasi
│   │   ├── HomeScreen.tsx          # Daftar transaksi
│   │   ├── GenerateQRScreen.tsx    # Generate QR code
│   │   ├── PaymentScreen.tsx       # Simulasi pembayaran
│   │   └── TrackerScreen.tsx       # Tracking transaksi
│   ├── services/
│   │   └── api.ts                  # API client & endpoints
│   └── utils/
│       └── helpers.ts              # Utility functions
└── package.json
```

## Fitur Aplikasi

1. **Home Screen**
   - Tampilkan daftar transaksi
   - Filter transaksi berdasarkan reference no, merchant ID, atau status
   - Refresh data transaksi

2. **Generate QR Screen**
   - Buat QR code untuk transaksi baru
   - Download/share QR code

3. **Payment Screen**
   - Simulasi proses pembayaran
   - Validasi form sebelum submit

4. **Tracker Screen**
   - Cari dan track status transaksi berdasarkan reference number

## Troubleshooting

### Error: "Gagal memuat transaksi. Pastikan server berjalan di localhost:8080"

Pastikan backend server sudah berjalan:
```bash
# Di terminal terpisah, jalankan backend server
cd path/to/backend
npm start
```

### Error: Module not found: react-native-safe-area-context

Solusi:
```bash
npm install react-native-safe-area-context@^4.8.2
```

### Masalah dengan React Native Metro Bundler

Clear cache dan rebuild:
```bash
npm start -- --reset-cache
```

## Development Notes

- Aplikasi menggunakan **axios** untuk HTTP requests
- UI menggunakan **React Native StyleSheet** untuk styling
- Navigation menggunakan **@react-navigation/bottom-tabs** dengan 4 tab
- Icons menggunakan **@expo/vector-icons (Ionicons)**
- QR code generation menggunakan **react-native-qrcode-svg**

## Catatan Penting

✅ Sudah kompatibel dengan React Native 0.73
✅ Menggunakan TypeScript
✅ Menggunakan functional components dengan hooks
✅ Proper error handling di setiap API call
