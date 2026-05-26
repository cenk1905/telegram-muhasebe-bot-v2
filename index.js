const { Client, GatewayIntentBits } = require('discord.js'); // eğer discord değil telegram ise söyle düzeltirim
require('dotenv').config();

// Telegram bot kullanıyorsan (telegraf öneriyorum)
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// START komutu
bot.start((ctx) => {
    ctx.reply('Bot aktif 🚀');
});

// basit test mesaj
bot.on('text', (ctx) => {
    ctx.reply('Mesaj alındı 👍');
});

// hata yakalama (crash önler)
bot.catch((err) => {
    console.log('Bot error:', err);
});

bot.launch();

console.log('Bot çalışıyor...');