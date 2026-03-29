# ⚡ Quick Start Guide

## 🎯 5-Minute Setup

### 1. Install & Run Backend
```bash
# Terminal 1 - Backend
cd ../backend  # or wherever your backend is
npm install
npm start
# Should output: Server running on http://localhost:8080
```

### 2. Install Dependencies
```bash
# Terminal 2 - Mobile App
npm install
```

### 3. Start Metro Bundler
```bash
# Terminal 2
npm start
```

### 4. Run Application
```bash
# Terminal 3 - Run app
# For iOS:
npm run ios

# For Android:
npm run android
```

**That's it!** 🎉

---

## 🔗 Useful Commands

```bash
# Start development
npm start                    # Metro bundler
npm run ios                  # iOS simulator
npm run android             # Android emulator
npm run lint                # Check code style
npm run test                # Run tests

# Clean & rebuild
npm install                 # Install all deps
npm start -- --reset-cache # Clear Metro cache
rm -rf node_modules && npm install  # Full clean

# iOS specific
cd ios && pod install && cd ..     # Update pods
open ios/PaymentGatewayProjectMobile.xcworkspace # Open in Xcode

# Android specific  
cd android && ./gradlew clean && cd ..  # Clean gradle
```

---

## 🐛 Troubleshooting Quick Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module 'react-native-safe-area-context'` | Run `npm install` |
| `Gagal memuat transaksi` | Start backend at `localhost:8080` |
| White screen on startup | Press `r` in Metro terminal to reload |
| Metro cache issue | Run `npm start -- --reset-cache` |
| iOS pods error | Run `cd ios && pod install && cd ..` |
| Android build error | Run `cd android && ./gradlew clean && cd ..` |

---

## 📱 App Screens

| Screen | Purpose | Test Data |
|--------|---------|-----------|
| **Home** | View transactions | Auto-loaded from API |
| **Generate QR** | Create QR code | PRN: `PRN-2024-001`, Amount: `100000` |
| **Payment** | Simulate payment | Reference: `PRN-2024-001`, Amount: `100000` |
| **Tracker** | Find transaction | Search by reference number |

---

## 🔧 Key Files to Modify

```
App.tsx                 ← Main app entry point
src/screens/            ← UI screens
  ├── HomeScreen.tsx    ← Transaction list
  ├── PaymentScreen.tsx ← Payment form
  ├── GenerateQRScreen.tsx ← QR generation
  └── TrackerScreen.tsx ← Transaction search

src/services/api.ts     ← API calls
src/utils/helpers.ts    ← Utilities
```

---

## 📖 Documentation Reference

| Document | Content |
|----------|---------|
| **SETUP_INSTRUCTIONS.md** | Complete step-by-step setup (start here) |
| **COMPATIBILITY_FIXES.md** | React Native 0.73 technical details |
| **TROUBLESHOOTING.md** | Common issues & detailed solutions |
| **FIXES_SUMMARY.md** | All changes made to the app |
| **REACT_NATIVE_73_FIXES.md** | Detailed technical report |

---

## ✅ Pre-Launch Checklist

Before pushing to production:

- [ ] Backend server running
- [ ] All dependencies installed: `npm list`
- [ ] No TypeScript errors: `npm run lint`
- [ ] App launches without errors
- [ ] All screens navigable
- [ ] API calls working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Tested on actual device (not just simulator)

---

## 🆘 Emergency Fixes

```bash
# Nuclear option - clean everything
rm -rf node_modules ios/Pods android/.gradle build/
npm cache clean --force
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache

# Then run app again
npm run ios  # or npm run android
```

---

## 🌐 API Endpoints

Backend server must be running at `http://localhost:8080`:

```
GET    /api/v1/transactions?page=1&limit=10  - List transactions
POST   /api/v1/signature                       - Generate signature  
POST   /api/v1/qr/generate                     - Generate QR code
POST   /api/v1/qr/payment                      - Process payment
GET    /api/v1/tracker/{referenceNo}           - Track transaction
```

Test with:
```bash
curl http://localhost:8080/api/v1/transactions?page=1&limit=10
```

---

## 📊 Project Structure

```
project-root/
├── App.tsx                 # Main component
├── index.js               # Entry point
├── app.json               # App config
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── .env.example           # Environment template
│
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── GenerateQRScreen.tsx
│   │   └── TrackerScreen.tsx
│   ├── services/          # API & services
│   │   └── api.ts
│   └── utils/             # Utilities
│       └── helpers.ts
│
├── ios/                   # iOS native code
├── android/               # Android native code
│
└── docs/                  # Documentation
    ├── SETUP_INSTRUCTIONS.md
    ├── COMPATIBILITY_FIXES.md
    ├── TROUBLESHOOTING.md
    ├── FIXES_SUMMARY.md
    └── REACT_NATIVE_73_FIXES.md
```

---

## 💡 Tips & Tricks

### Fast Reload
Press `r` in Metro terminal to reload app without restarting

### Access Developer Menu
- iOS: `Cmd + D` in simulator
- Android: Shake device or `Cmd + M` (Mac) / `Ctrl + M` (Linux/Windows)

### Debug in Chrome
From Developer Menu → "Debug with Chrome"

### View Performance
From Developer Menu → "Show Perf Monitor"

### Clear App Cache
- iOS: In Simulator, Device → Erase All Content and Settings
- Android: In Emulator, Settings → Apps → [App Name] → Clear Cache

---

## 🔄 Regular Workflow

```bash
# Morning: Check for updates
npm outdated
npm audit

# During development
npm start           # Terminal 1
npm run ios         # Terminal 2

# Make code changes → Auto-reload with hot reload!

# After major changes
npm start -- --reset-cache

# Before commit
npm run lint
npm run test
```

---

## 📚 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Axios HTTP Client](https://axios-http.com)
- [TypeScript](https://www.typescriptlang.org)
- [Expo Vector Icons](https://icons.expo.fyi)

---

## 🎯 Next Steps

1. ✅ Run app successfully
2. ✅ Test all 4 screens
3. ✅ Try creating QR code
4. ✅ Try payment simulation
5. ✅ Check console for any warnings
6. 📖 Read COMPATIBILITY_FIXES.md for tech details
7. 🚀 Ready for development!

---

## ⚡ Pro Tips

### Faster Development
1. Use iOS simulator (faster than Android)
2. Keep Metro bundler running in separate terminal
3. Use keyboard shortcut for reload instead of manual
4. Monitor console for errors in real-time

### Better Debugging
1. Add `console.log()` for debugging
2. Use React DevTools Chrome extension
3. Check Metro terminal output first
4. Use `debugger` keyword for breakpoints

### Performance
1. Use FlatList for long lists (already done)
2. Memoize heavy computations
3. Avoid inline functions in render
4. Use React DevTools Profiler

---

**Status:** Ready to Go! 🚀

For detailed guides, see:
- Full Setup: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

Happy Coding! 💻
