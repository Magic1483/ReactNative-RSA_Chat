Write-Host -ForegroundColor Red "Start Build!"
del .\android\app\build\outputs\apk\release\*
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ ;
cd android ; ./gradlew assembleRelease ;cd ..;
Write-Host -ForegroundColor Red "Build Complete !!"
