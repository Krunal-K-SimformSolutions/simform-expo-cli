/**
 *
 */
export const GitIgnoreTemplate = (): string => {
  return `
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

npm-debug.*
# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/reset-project
*.keystore
!debug.keystore

# node.js
node_modules/
npm-debug.log
yarn-error.log
package-lock.json
yarn.lock

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# Bundle artifact
*.jsbundle

# Ruby / CocoaPods
/ios/Pods/
/vendor/bundle/
Podfile.lock

# react-native-config codegen
.env
.env.development
.env.preview
ios/tmp.xcconfig

# Ignore native Android and iOS build folders in Expo
/ios/
/android/

*.app 
*.apk
*.tar.gz
*.aab
  `;
};
