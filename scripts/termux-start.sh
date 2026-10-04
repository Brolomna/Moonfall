#!/data/data/com.termux/files/usr/bin/sh
# One-tap Moonfall host for Android (Termux): update, build, start, open the host screen.
#   sh scripts/termux-start.sh
# The join QR picks up the phone's current Wi-Fi IP by itself. If the phone is the hotspot,
# pass its hotspot IP instead:  PUBLIC_HOST=192.168.43.1 sh scripts/termux-start.sh
cd "$(dirname "$0")/.." || exit 1

before=$(git rev-parse HEAD 2>/dev/null)
git pull --ff-only || echo "⚠  Couldn't update (offline?) — starting the version already here."
after=$(git rev-parse HEAD 2>/dev/null)

# Reinstall / rebuild only when something changed (or on the first run).
if [ ! -d node_modules ] || [ "$before" != "$after" ]; then npm install || exit 1; fi
if [ ! -f dist/index.html ] || [ "$before" != "$after" ]; then npm run build:web || exit 1; fi

termux-wake-lock 2>/dev/null # keep Android from pausing the server when the screen turns off
(sleep 4 && termux-open-url http://localhost:3000/host) &
npm start
