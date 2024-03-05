## BUILD 
- `keytool -genkey -v -keystore mp3-key.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000`

- `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`

- `cd android ; ./gradlew assembleRelease ;cd ..`

- `adb  -s <device_id> install -r .\android\app\build\outputs\apk\release\app-release.apk`

