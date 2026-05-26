const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✔ izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
].map(u => u.toLowerCase());

// 💰 DATABASE
let total = 0;
let count = 0;
let logs = [];

// 🔥 TEK MESAJ HANDLER (ÇİFT SAYMA YOK)
bot.on('text', (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // ❌ izinli değil
    if (!allowedUsers.includes(user)) return;

    // 📊 SAY KOMUTU
    if (text === 'say') {
        ctx.reply(
            `📊 BUGÜN RAPOR\n\n` +
            `💰 TOPLAM: ${total} TL\n` +
            `📌 İŞLEM SAYISI: ${count}`
        );
        return;
    }

    // ❌ reply değilse çık
    if (!ctx.message.reply_to_message) return;

    // ❌ onay yoksa çık
    if (!text.includes('onay')) return;

    // 🔢 sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    // ❌ duplicate engel (EN ÖNEMLİ FIX)
    const msgId = ctx.message.message_id;
    if (logs.includes(msgId)) return;
    logs.push(msgId);

    total += amount;
    count++;

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');