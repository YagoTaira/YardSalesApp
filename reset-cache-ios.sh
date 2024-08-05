#!/bin/bash

# Clear Metro Bundler cache
rm -rf /tmp/metro-*
rm -rf $TMPDIR/metro-*

# Clear watchman cache
watchman watch-del-all

# Clear node_modules cache
rm -rf node_modules/.cache

# Clear iOS build directory
cd ios
rm -rf build
xcodebuild clean
pod install
cd ..

# Start Expo with cache reset
# npx expo start -c &

# Wait for Expo to start and run the app on iOS device
sleep 10
npx expo run:ios --device