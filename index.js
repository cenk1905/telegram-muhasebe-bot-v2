const { Telegraf } = require('telegraf');

// BOT TOKEN Railway'den gelecek
const bot = new Telegraf(process.env.BOT_TOKEN);

// BOT START
bot.start((ctx) => {
    ctx.reply('🚀 Bot aktif!');
});

// MESAJ ALMA
bot.on('text', (ctx) => {
    const text = ctx.message.text.toLowerCase();

    // SAY komutu
    if (text === 'say') {
        ctx.reply('📊 Sistem çalışıyor');
        return;
    }

    // ONAY kontrolü
    if (text.includes('onay')) {
        ctx.reply('✅ Onay alındı ve kaydedildi');
        return;
    }

    ctx.reply('Mesaj alındı 👍');
});

// HATA YAKALAMA (crash önler)
bot.catch((err) => {
    console.log('Bot error:', err);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');