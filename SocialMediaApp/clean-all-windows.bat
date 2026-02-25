@echo off
echo "   ____                      "
echo "  __,-~~/~    \`---.                 "
echo " _/_,---(      ,    )                "
echo "/__ /        <    /   )  \___        "
echo "====------------------===;;;==       "
echo "    \/  ~"~"~"~"~"~\"~)~",1/          "
echo "    (_ (   \  (     >    \)          "
echo "     \_( _ <         >_>'            "
echo "        ~ \`-i' ::>|--"               "
echo "            I;|.|.|                  "
echo "           <|i::|i|>                 "
echo "            |[::|.|                  "
echo "             ||: |                   "
echo "______________________REACT NATIVE CLEAN ALL________________ "

echo "____________________________________________________________"
echo "About to clean node_modules"
rmdir /s /q node_modules
echo "Done cleaning node_modules"
echo "____________________________________________________________"
echo "About to install node_modules"
npm install --legacy-peer-deps
echo "Done installing node_modules"
echo "____________________________________________________________"
echo "About to clean the builds for android"
cd android && gradlew clean && cd ..
echo "Done cleaning builds for android"
echo "____________________________________________________________"
echo "About to clean rn cache"
set TMPDIR=%USERPROFILE%\AppData\Local\Temp
rd /s /q %TMPDIR%\react-* && rd /s /q %TMPDIR%\react-native-packager-cache-* && rd /s /q %TMPDIR%\metro-bundler-cache-* && watchman watch-del-all && npx react-native start --reset-cache
echo "Done cleaning rn cache"
echo "____________________________________________________________"
