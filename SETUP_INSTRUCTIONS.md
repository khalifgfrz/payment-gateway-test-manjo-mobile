# 📖 Setup Instructions - Payment Gateway Mobile App

## Prerequisites

Sebelum memulai, pastikan sudah install:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** atau **yarn** (biasanya sudah termasuk saat install Node.js)
- **Xcode** (untuk iOS development, hanya di macOS)
- **Android Studio** (untuk Android development)
- **Git** (optional, untuk version control)

Verifikasi versi:
```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
```

---

## Step 1: Clone / Setup Repository

```bash
# Jika belum clone repository
git clone https://github.com/khalifgfrz/payment-gateway-test-manjo-mobile.git
cd payment-gateway-test-manjo-mobile

# Atau jika sudah ada folder projectnya:
cd payment-gateway-test-manjo-mobile
```

---

## Step 2: Install Dependencies

```bash
# Install semua npm packages
npm install

# atau jika menggunakan yarn:
yarn install

# Verifikasi installation berhasil:
npm list react-native
# Output should show: react-native@0.73.0
```

**Troubleshooting jika error:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## Step 3: Backend Setup (PENTING!)

Aplikasi memerlukan backend API untuk berjalan. Pastikan backend server sudah berjalan di `http://localhost:8080/api/v1`

**Jika belum punya backend:**
```bash
# Contoh: Setup backend di folder terpisah
cd ../
git clone <backend-repo-url> payment-gateway-backend
cd payment-gateway-backend

# Install dan run backend
npm install
npm start
# Backend should run at http://localhost:8080
```

**Verifikasi backend berjalan:**
```bash
# Di terminal baru, test API:
curl http://localhost:8080/api/v1/transactions?page=1&limit=10

# Jika response OK, backend sudah ready!
```

---

## Step 4: iOS Setup (macOS Only)

### 4.1 Install CocoaPods Dependencies
```bash
# Navigate ke ios folder
cd ios

# Install pods
pod install

# Back to root directory
cd ..
```

### 4.2 Verify Xcode Setup
```bash
# Verify Xcode installed correctly
xcode-select --print-path
# Should output: /Applications/Xcode.app/Contents/Developer

# If not, install:
xcode-select --install
```

### 4.3 Run on iOS
```bash
# Option 1: Using npm command
npm run ios

# Option 2: Using Xcode directly
xed -b ios

# Then in Xcode:
# 1. Select "PaymentGatewayProjectMobile" scheme
# 2. Select simulator or device
# 3. Click Run (Play button)
```

**Common iOS Issues:**

```bash
# If Pod installation fails:
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# If Xcode build fails:
xcode-select --reset

# Or clean build:
cd ios && xcodebuild clean -workspace PaymentGatewayProjectMobile.xcworkspace -scheme PaymentGatewayProjectMobile && cd ..
```

---

## Step 5: Android Setup

### 5.1 Verify Android Studio Setup
```bash
# Check Android SDK installed:
# On Mac: ~/Library/Android/sdk
# On Linux: ~/Android/sdk
# On Windows: C:\Users\<username>\AppData\Local\Android\sdk

# Set ANDROID_HOME (if not already set):
# On Mac/Linux:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

# Add to ~/.bash_profile or ~/.zshrc for persistence

# On Windows (in Command Prompt):
setx ANDROID_HOME C:\Users\<YourUsername>\AppData\Local\Android\sdk
```

### 5.2 Start Android Emulator
```bash
# List available emulators:
emulator -list-avds

# Start emulator (replace "Pixel_4_API_30" with your emulator name):
emulator -avd Pixel_4_API_30

# Or use Android Studio UI:
# Open Android Studio > Tools > Device Manager > Create/Run emulator
```

### 5.3 Run on Android
```bash
# Option 1: Using npm command (auto detect connected device/emulator)
npm run android

# Option 2: Manual with gradle
cd android
./gradlew installDebug
cd ..

# Option 3: Check connected devices first
adb devices
# Then run: npm run android
```

**Common Android Issues:**

```bash
# If gradle build fails:
cd android && ./gradlew clean && cd ..

# If adb not found, set PATH:
export PATH=$PATH:$ANDROID_HOME/platform-tools

# If emulator not starting:
# Clear emulator data and restart
emulator -avd <emulator-name> -wipe-data
```

---

## Step 6: Run Metro Bundler (Terminal 1)

Metro Bundler adalah development server untuk React Native:

```bash
npm start

# Output seharusnya:
# ┌──────────────────────────────────────────────────────────┐
# │                                                          │
# │  Welcome to Metro!                                       │
# │  Fast - Scalable - Integrated                            │
# │                                                          │
# └──────────────────────────────────────────────────────────┘
# 
# Live reload enabled.
# 
# To reload the app press 'r'
# To open developer menu press 'd'
```

**Options:**
```bash
# Reset cache (jika ada cache issue):
npm start -- --reset-cache

# Clear Watchman cache (macOS):
watchman watch-del-all
npm start

# Specify port:
npm start -- --port=8081
```

---

## Step 7: Run Application (Terminal 2)

Di terminal baru (jangan stop Metro Bundler):

### For iOS:
```bash
npm run ios
```

### For Android:
```bash
npm run android
```

### First Time Setup
Aplikasi akan:
1. Compile code
2. Build app package
3. Install ke device/emulator
4. Auto launch app
5. Connect ke Metro Bundler

---

## ✅ Verification Checklist

Setelah semua langkah di atas, verifikasi:

- [ ] Node.js v18+ installed: `node --version`
- [ ] npm packages installed: `npm list react-native`
- [ ] Backend server running: `curl http://localhost:8080/api/v1/transactions?page=1&limit=10`
- [ ] iOS pods installed (Mac): `ls ios/Pods`
- [ ] Android SDK configured: Check Android Studio
- [ ] Metro Bundler running: Check terminal output
- [ ] App launching tanpa error
- [ ] App connecting ke backend API
- [ ] Transactions loading di Home Screen

---

## 🎮 Development Workflow

### Normal Development
```bash
# Terminal 1: Start Metro Bundler
npm start

# Terminal 2: Run application
# For iOS:
npm run ios

# For Android:
npm run android

# Or manually reload after code changes:
# - iOS: Press 'r' in Metro Bundler
# - Android: Double-tap 'r' on device or press 'r' in terminal
```

### Hot Reload Shortcut
Metro Bundler otomatis hot reload ketika file berubah. Untuk manual reload:

**iOS:**
- Press 'r' in Metro Bundler terminal
- Or in app: Cmd+r

**Android:**
- Press 'r' in Metro Bundler terminal
- Or in app: Double-tap 'r'
- Or shake device and select "Reload"

### Developer Menu
```bash
# iOS:
Cmd + D (dalam simulator)

# Android:
Cmd + M (macOS) / Ctrl + M (Linux/Windows) pada device
atau shake device
```

Dari Developer Menu bisa:
- Reload JavaScript
- Enable/Disable Fast Refresh
- Debug with Chrome DevTools
- Enable Element Inspector
- View Perf Monitor

---

## 📱 Testing the App

### Test Transactions List
1. Buka **Home Screen** tab
2. Aplikasi otomatis fetch transactions dari backend
3. Lihat list transactions dengan status
4. Try refresh button atau filter

### Test QR Generation
1. Buka **Generate QR** tab
2. Fill form:
   - Partner Reference No: `PRN-2024-001`
   - Merchant ID: `MERCHANT123`
   - Transaction ID: `TRX-2024-001`
   - Amount: `100000`
3. Click "Generate QR Code"
4. See QR code displayed
5. Try "Download QR Code" atau "Generate Another"

### Test Payment Simulation
1. Buka **Payment** tab
2. Fill form:
   - Reference No: `PRN-2024-001` (dari QR generation)
   - Amount: `100000`
3. Click "Proses Pembayaran"
4. See response with success/error message

### Test Transaction Tracking
1. Buka **Tracker** tab
2. Input reference number dari transaction
3. Click "Cari"
4. Lihat detail transaction

---

## 🔗 Useful Links

- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Metro Bundler:** https://facebook.github.io/metro/
- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **Axios HTTP:** https://axios-http.com/docs/intro
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 🆘 Troubleshooting

Jika mengalami error, lihat **TROUBLESHOOTING.md** untuk:
- Common errors dan solutions
- API endpoint testing
- Performance optimization
- Debugging tips

---

## 🎉 Success!

Jika semua langkah di atas berhasil, aplikasi sudah siap untuk development!

**Next Steps:**
1. Explore aplikasi functionality
2. Modify code dan see hot reload
3. Check COMPATIBILITY_FIXES.md untuk detail React Native 0.73 compatibility
4. Read FIXES_SUMMARY.md untuk overview semua perbaikan

---

**Happy Coding!** 🚀

Last Updated: 2024
React Native: 0.73.0
