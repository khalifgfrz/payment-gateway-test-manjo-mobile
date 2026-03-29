# Error Fix Guide: expo-font Module Not Found

## Problem Description

```
Error: Unable to resolve module expo-font from D:\Project\PaymentGatewayProjectMobile\node_modules\@expo\vector
Module does not exist in the Haste module map or in these directories: ...
```

**Root Cause:** `expo-font` package dependency missing or corrupted in node_modules

---

## Solution: 3-Step Fix Process

### Step 1: Automated Fix (Recommended)

**For Windows (CMD/PowerShell):**
```bash
cd /d D:\Project\PaymentGatewayProjectMobile
.\scripts\fix-dependencies.bat
```

**For macOS/Linux:**
```bash
cd /path/to/PaymentGatewayProjectMobile
bash scripts/fix-dependencies.sh
```

### Step 2: Manual Fix (If automated fails)

```bash
# 1. Remove corrupted node_modules
rm -rf node_modules          # macOS/Linux
rmdir /s /q node_modules     # Windows

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall all dependencies
npm install

# 4. Reinstall expo-font explicitly
npm install expo-font @expo/vector-icons --save

# 5. Clear Metro cache
npm start -- --reset-cache
```

### Step 3: Verify Fix

```bash
# 1. Check if expo-font is installed
npm list expo-font

# Expected output:
# └── expo-font@11.10.0
```

---

## Common Variations of This Error

| Error | Cause | Fix |
|-------|-------|-----|
| `Unable to resolve module expo-font` | Missing dependency | Run `npm install expo-font` |
| `Module does not exist in the Haste module map` | Corrupted cache | Run `npm start -- --reset-cache` |
| `@expo/vector-icons missing fonts` | Partial installation | Run full `npm install` |
| `createIconSet.js: expo-font could not be found` | Dependency conflict | Clear & reinstall node_modules |

---

## Prevention: Proper Setup

### 1. First Time Setup (After cloning repo)

```bash
# 1. Install Node.js 18+ and npm 8+
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# 2. Navigate to project
cd PaymentGatewayProjectMobile

# 3. Install dependencies
npm install

# 4. On macOS, install pods for iOS
cd ios
pod install
cd ..

# 5. Start development server
npm start
```

### 2. Regular Development

```bash
# Run development server
npm start

# Press 'a' for Android or 'i' for iOS
# Let Metro bundler finish compilation (may take 1-2 minutes first time)
```

### 3. Metro Cache Issues

```bash
# If you see module resolution errors:
npm start -- --reset-cache

# If that doesn't work:
npm start -- --reset-cache --verbose

# Last resort:
rm -rf node_modules && npm install
npm start -- --reset-cache
```

---

## Expected Dependencies in package.json

Your `package.json` should include:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "^50.0.0",
    "expo-font": "^11.10.0",
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-safe-area-context": "^4.7.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-screens": "^3.27.0"
  }
}
```

---

## Troubleshooting Steps (In Order)

### Issue 1: Still getting expo-font error after npm install

**Solution:**
```bash
# Clear all caches and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Then start with reset cache
npm start -- --reset-cache --verbose
```

### Issue 2: Metro bundler stuck or slow

**Solution:**
```bash
# Kill all Metro processes
ps aux | grep metro | grep -v grep | awk '{print $2}' | xargs kill -9  # macOS/Linux

# For Windows:
# taskkill /F /IM node.exe

# Restart
npm start -- --reset-cache
```

### Issue 3: Still failing after all fixes

**Nuclear Option:**
```bash
# Complete clean installation
rm -rf node_modules package-lock.json .expo

# Clear npm cache
npm cache clean --force

# Fresh install
npm install

# For iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Start fresh
npm start -- --reset-cache
```

---

## Performance Tips

1. **Use `.watchmanrc` to optimize Metro:**
```json
{
  "ignore_dirs": ["node_modules", ".git", ".expo", "ios", "android"]
}
```

2. **Increase Node memory if bundling is slow:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

3. **Use fast refresh (enabled by default):**
```bash
npm start -- --reset-cache --no-clear
```

---

## Verify Installation

After following the fixes, verify everything works:

```bash
# Check Node version
node --version   # Should be 18.0.0+

# Check npm version
npm --version    # Should be 8.0.0+

# Check if expo-font is installed
npm list expo-font

# Check if @react-navigation is installed
npm list @react-navigation/native

# Start app
npm start

# You should see Metro Bundler welcome screen
```

---

## Still Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed setup
2. Check `TROUBLESHOOTING.md` for other common issues
3. Review `package.json` to ensure all dependencies are correct
4. Check Node.js version compatibility (need 18.0.0+)
