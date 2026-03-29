#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== React Native 0.73 Dependency Fix Script ===${NC}"
echo ""

# Step 1: Remove node_modules
echo -e "${YELLOW}Step 1: Removing node_modules...${NC}"
rm -rf node_modules
echo -e "${GREEN}✓ node_modules removed${NC}"
echo ""

# Step 2: Clear npm cache
echo -e "${YELLOW}Step 2: Clearing npm cache...${NC}"
npm cache clean --force
echo -e "${GREEN}✓ npm cache cleared${NC}"
echo ""

# Step 3: Clear Metro cache
echo -e "${YELLOW}Step 3: Clearing Metro bundler cache...${NC}"
rm -rf ~/.metro-bundler-cache* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
echo -e "${GREEN}✓ Metro cache cleared${NC}"
echo ""

# Step 4: Reinstall dependencies
echo -e "${YELLOW}Step 4: Reinstalling npm packages...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 5: Install Expo dependencies if needed
echo -e "${YELLOW}Step 5: Ensuring Expo dependencies are installed...${NC}"
npm install expo-font @expo/vector-icons --save
echo -e "${GREEN}✓ Expo dependencies verified${NC}"
echo ""

echo -e "${GREEN}=== Fix Complete! ===${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. If on iOS: cd ios && pod install && cd .."
echo "2. Run: npm start -- --reset-cache"
echo "3. Press 'i' for iOS or 'a' for Android"
echo ""
echo -e "${YELLOW}Common issues:${NC}"
echo "- If error persists, try: npm start -- --reset-cache --verbose"
echo "- Clear app cache on device"
echo "- Restart development server"
