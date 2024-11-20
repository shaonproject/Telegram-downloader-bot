
---

# Telegram video downloader bot

A Telegram bot that allows users to download media videos in various qualities. Powered by **Mohammad Nayan**.

## Features

- Download media videos in **low**, **mp3** and **high** quality.
- Easy to use with inline buttons for selecting video quality.
- Powered by **Mohammad Nayan**.

## Prerequisites

To use this bot, you will need:

- **Node.js** installed on your system (for backend).
- A **Telegram Bot Token** from [BotFather](https://core.telegram.org/bots#botfather).
- An internet connection to download media videos.

## Installation

1. Clone this repository or copy the code into your local project.

```bash
git clone https://github.com/MOHAMMAD-NAYAN/Telegram-downloader-bot.git
cd Telegram-downloader-bot
```

2. Install the required dependencies using npm:

```bash
npm install
```

3. Replace the `token` variable with your Telegram bot token:

```javascript
let token = 'YOUR_BOT_TOKEN';  // Replace with your actual Telegram bot token
```

4. Run the bot using:

```bash
node index.js
```

5. Start the bot by searching for it on Telegram and typing `/start`.

## How to Use

1. **Start a Conversation**:
   - Open the bot in Telegram and type `/start`.
   - The bot will introduce itself and provide a short description of its capabilities.

2. **Download TikTok Videos**:
   - Send a TikTok video URL to the bot (e.g., `https://www.tiktok.com/@username/video/1234567890`).
   - The bot will process the video and present options for choosing between **low** and **high** quality.
   - Choose the video quality, and the bot will send the video directly to your chat.

## Commands

- `/start`: Starts the bot and provides instructions on how to use it.
