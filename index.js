const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { alldown } = require('shaon-media-downloader');
const fs = require('fs');
const port = process.env.PORT || 4000;
const callbackDataStore = {};
const BOT_TOKEN = '7529156928:AAHFB5GOA9cOU89VN1d-oi1KvTw6M7YhiMI';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function removeHashtags(text) {
    return text.replace(/#\S+/g, '').trim();
}

function escapeMarkdown(text) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

bot.onText(/\/start|start@.+/, async (msg) => {
    const chatId = msg.chat.id;

    const welcomeMessage = `
🌟✨ ❝ *Welcome to the Shaon All-in-One Video Downloader Bot!* ❞ ✨🌟

🎥 _Effortlessly download videos from multiple platforms._  
🔗 _Send me a valid video link, and I’ll do the rest!_

──────────────────────────  
💻 *Supported Platforms:*  
   🔹 [🌐 Facebook](https://www.facebook.com)  
   🔹 [🎵 TikTok](https://www.tiktok.com)  
   🔹 [🐦 Twitter](https://www.twitter.com)  
   🔹 [📸 Instagram](https://www.instagram.com)  
   🔹 [▶️ YouTube](https://www.youtube.com)  
   🔹 [📌 Pinterest](https://www.pinterest.com)  
   🔹 [🗂️ Google Drive](https://drive.google.com)  
   🔹 [✂️ CapCut](https://www.capcut.com)  
   🔹 [🎭 Likee](https://www.likee.video)  
   🔹 [🌐 Threads](https://www.threads.net)  

──────────────────────────  
👨‍💻 *Developer*:  
   ❝ *Shaon Ahmed* ❞  

📞 *Reach Out*:  
   🔹 [Facebook](https://www.facebook.com/Hey.Its.Me.Shaon.Ahmed)  
   🔹 [Telegram](https://t.me/shaonproject)  

🚀 *Fast. Reliable. Easy to use.*  
💡 *Start downloading now and enjoy the convenience!*


    `;

    await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown', disable_web_page_preview: true });
});



bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith('https://')) {
        const loadingMsg = await bot.sendMessage(chatId, '⏳ Fetching and processing media...');
        try {
            const response = await alldown(text);
            if (response.status) {
                const { title, high, low } = response.data;
               const tit = removeHashtags(title);
                const escapedTitle = escapeMarkdown(tit);
                const sessionId = `session_${Date.now()}`;
                callbackDataStore[sessionId] = { title: escapedTitle, high, low };

                const markdown = `
🎬 *Title:* ${escapedTitle}
📥 Please select a format to download:
                `;

                const replyMarkup = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '📹 HD Quality Video', callback_data: `${sessionId}|high` }],
                            [{ text: '📹 Normal Quality Video', callback_data: `${sessionId}|low` }],
                            [{ text: '🎵 Extract MP3', callback_data: `${sessionId}|mp3` }],
                        ],
                    },
                };

                const selectMsg = await bot.sendMessage(chatId, markdown, {
                    parse_mode: 'Markdown',
                    ...replyMarkup,
                });

                setTimeout(() => bot.deleteMessage(chatId, selectMsg.message_id), 10000);
            } else {
                bot.sendMessage(chatId, '❌ Media not found. Please check the URL and try again.');
            }
        } catch (error) {
            bot.sendMessage(chatId, '❌ Failed to fetch media. Please try again later.');
        } finally {
            bot.deleteMessage(chatId, loadingMsg.message_id);
        }
    }
});

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const [sessionId, type] = callbackQuery.data.split('|');
    const session = callbackDataStore[sessionId];

    if (!session) {
        return;
    }

    const { title, high, low } = session;

    if (type === 'high' || type === 'low') {
        const quality = type === 'high' ? 'HD' : 'Normal';
        const url = type === 'high' ? high : low;
        const loadingMsg = await bot.sendMessage(chatId, `⏳ Sending ${quality} Quality Video...`);

        let nayan;

          try {
              const vidResponse = await axios.get(url, { responseType: 'stream' });
              nayan = vidResponse?.data || url;
                } catch (error) {
                  nayan = url;
          }
        await bot.sendVideo(chatId, nayan, {
            caption: `🎬 *Title:* ${title}\n📹 *Quality:* ${quality}`,
            parse_mode: 'Markdown',
        });

        bot.deleteMessage(chatId, loadingMsg.message_id);
    } else if (type === 'mp3') {
        const loadingMsg = await bot.sendMessage(chatId, '🎵 Extracting MP3, please wait...');
        const audioPath = `Nayan_${Date.now()}.mp3`;

        try {
            const audioStream = await axios({
                url: high,
                method: 'GET',
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(audioPath);
            audioStream.data.pipe(writer);

            writer.on('finish', async () => {
                await bot.sendAudio(chatId, audioPath, {
                    caption: `🎵 *Extracted Audio from:* ${title}`,
                    parse_mode: 'Markdown',
                });
                fs.unlinkSync(audioPath);
                bot.deleteMessage(chatId, loadingMsg.message_id);
            });

            writer.on('error', async () => {
                await bot.sendMessage(chatId, '❌ Failed to process the audio.');
                bot.deleteMessage(chatId, loadingMsg.message_id);
            });
        } catch {
            bot.sendMessage(chatId, '❌ Failed to extract MP3. Please try again later.');
            bot.deleteMessage(chatId, loadingMsg.message_id);
        }
    }

    delete callbackDataStore[sessionId];
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
   // loadUsersAndThreads();
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
