const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✔ izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
];

// 💰 RAM SYSTEM
let total = 0;
let count = 0;

// 📩 MESAJ KONTROL
bot.on('text', (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // ❌ izinli değilse çık
    if (!allowedUsers.includes(user)) return;

    // ❌ reply değilse çık
    if (!ctx.message.reply_to_message) return;

    // ❌ onay yoksa çık
    if (!text.includes('onay')) return;

    // 🔢 sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    total += amount;
    count++;

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

// 📊 SAY KOMUTU (FIXED)
bot.on('text', (ctx) => {

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    if (user !== '@vertexfinans') return;

    if (text !== 'say') return;

    ctx.reply(
        `📊 BUGÜN RAPOR\n\n` +
        `💰 TOPLAM: ${total} TL\n` +
        `📌 İŞLEM SAYISI: ${count}`
    );
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');