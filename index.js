const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// OWNER
const owner = '@vertexfinans';

// veri
let total = 0;
let count = 0;

// MESAJ
bot.on('text', (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // SADECE OWNER VEYA İZİNLİLER
    const allowedUsers = [
        '@vertexfinans',
        '@finans_admin34',
        '@donciccio5',
        '@soyluuu'
    ];

    if (!allowedUsers.includes(user)) return;

    // SADECE REPLY
    if (!ctx.message.reply_to_message) return;

    // ONAY kontrol
    if (!text.includes('onay')) return;

    // sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    total += amount;
    count++;

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

// OWNER SAY KOMUTU
bot.hears('say', (ctx) => {

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    if (user !== owner) return;

    ctx.reply(
        `📊 BUGÜN RAPOR\n\n` +
        `💰 TOPLAM: ${total} TL\n` +
        `📌 İŞLEM SAYISI: ${count}`
    );
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');