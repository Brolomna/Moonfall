🌕 Moonfall

A Werewolf party game web app designed for groups playing together on the same Wi-Fi network.

The host runs the game on their phone, while players scan a QR code with their own phones to join and view their secret role cards. Night actions, discussions, and voting happen in person. The app handles role assignment, night/day transitions, and step-by-step host guidance.

Getting Started

npm install
npm run dev

Open the URL displayed in your terminal. Your computer and phones must be connected to the same Wi-Fi network.

- Host: "http://<computer-ip>:5173/host"
- Player: Scan the QR code on the host screen or visit "http://<computer-ip>:5173/"

For game sessions, building the app and running it through a single server is more lightweight.

npm run build
npm start          # http://<computer-ip>:3000/host

«On macOS, you may see a prompt asking whether to allow incoming network connections the first time you run the app. Click Allow so phones can connect.

Fonts are loaded from Google Fonts, so the app falls back to system fonts when there is no internet connection.»

Features

Host Interface (3 Stages)

1. Lobby
   
   - Real QR code for inviting players
   - Default player interface language
   - House rules
   - List of joined players, with the ability to remove players

2. Role Setup
   
   - Configure the number of Werewolves, Villagers, and Masons
   - Select special roles
   - Balance indicator
   - Create and edit custom roles

3. Game Management
   
   - Switch between night and day, updating the background on every connected phone
   - Nighttime role wake-up order
   - Special situation cards
   - Manage player status: killed, exiled, or disconnected
   - Handle Doppelgänger mechanics
   - Determine victory conditions

Player Interface

- Enter a name → Wait in the lobby → View your role card
- Tap your card to flip it and reveal your role
- Your role card remains available until the game ends
- Dedicated cards for players who are killed or exiled
- Game guide
- Support for 7 languages

Project Structure

Path| Description
"server/index.ts"| Socket.IO room server (in-memory state, single room)
"src/views/"| UI screens converted from design mockups ("HostView" / "PlayerView")
"src/HostApp.tsx", "src/PlayerApp.tsx"| Server connection and integration
"design/"| Original design canvas files (".dc.html")
"tools/"| Mockup-to-React converter ("dc2tsx.py") and server integration patch ("wire.py")

Refer to "CLAUDE.md" for development instructions and project-specific guidance when working with Claude Code.

Potential Future Improvements

- Persist game state across server restarts (currently stored in memory only)
- Bundle fonts locally for a consistent design without internet access
- Add multilingual support to the host interface