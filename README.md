# 🍅 Tomato Timer Windows Desktop Widget

[**简体中文**](./README_zh-CN.md)

A lightweight, aesthetically pleasing, and immersive Windows desktop Pomodoro timer built with Electron. It mimics the macOS widget experience, running independently as a frameless, cool-toned glassmorphism floating window on the top layer.

## ✨ Core Features

- **Ultimate Immersive Appearance**: Translucent glassmorphism material, cross-platform frameless integration.
- **Genuine Native Desktop Widget**: Supports global always-on-top positioning without being obscured. Can be placed anywhere on the screen by dragging the title bar.
- **Smooth Adaptive Animations**: Built-in SVG synchronized decaying ring timer, multi-state adaptive cool-toned themes (Pomodoro Red / Mint Green / Sky Blue).
- **Media-Free Local Ringtones**: Uses the browser's underlying Web Audio API to synthesize light tones, without relying on external audio files, resulting in a smaller footprint.
- **Native System Notifications**: Seamlessly triggers Windows system message notifications in the bottom right corner when work ends, or a break starts/ends.
- **Smart Workflow Modes**:
  - Auto-management: A closed-loop cycle of "25 mins Pomodoro -> 5 mins Short Break".
  - Achievement incentive: Automatically suggests a 15-minute long break mode after completing 4 consecutive pomodoros.
  - Data retention: Today's focus data record automatically resets at midnight. Historical preference settings are permanently saved.

## 🚀 Quick Start

You need to install `Node.js` (v18+ recommended). It has been verified to run perfectly in the v22 environment.

1. **Clone/Enter project directory**
   ```bash
   cd Tomato-Timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

## 🛠️ Package as a Portable .exe (Optional)

If you want to send this tool to friends who don't have a development environment, you can package it as an `.exe` using `electron-builder`:

1. **Install local packager**:
   ```bash
   npm install electron-builder --save-dev
   ```
2. **Execute build script**:
   ```bash
   npx electron-builder --win
   ```

## 👨‍💻 Tech Stack

- Runtime Container: `Electron`
- UI Construction: Native `HTML5` + `Vanilla CSS3` (No frameworks, Custom design)
- Global Logic: Native `JavaScript` Toolset (`localStorage` / `Web Audio API`)