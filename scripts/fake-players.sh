#!/data/data/com.termux/files/usr/bin/sh
# Join fake players for testing — run in a second Termux session while the server is running.
#   sh scripts/fake-players.sh                                  → asks how many, joins this phone's server
#   sh scripts/fake-players.sh 6 myroom https://moonfall.onrender.com  → 6 players in room myroom on the deployed server
cd "$(dirname "$0")/.." || exit 1
exec npx tsx scripts/fake-players.ts "$@"
