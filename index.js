const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('🚀 Bot aktif!');
});

bot.on('text', (ctx) => {
    const text = ctx.message.text.toLowerCase();

    if (text === 'say') {
        ctx.reply('📊 Sistem çalışıyor');
        return;
    }

    if (text.includes('onay')) {
        ctx.reply('✅ Onay kaydedildi');
        return;
    }

    ctx.reply('Mesaj alındı 👍');
});

bot.catch((err) => {
    console.log('Bot error:', err);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');