const { Telegraf } = require('telegraf');

// BOT TOKEN (Railway Variables'tan gelir)
const bot = new Telegraf(process.env.BOT_TOKEN);

// START
bot.start((ctx) => {
    ctx.reply('🚀 Bot aktif!');
});

// mesaj
bot.on('text', (ctx) => {
    ctx.reply('👍 Mesaj alındı');
});

// hata yakalama
bot.catch((err) => {
    console.log('Bot error:', err);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');