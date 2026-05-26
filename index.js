const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✔ izinli kullanıcılar (onay yazabilenler)
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
].map(u => u.toLowerCase());

// ✔ SAY komutu kullanabilenler
const allowedSayUsers = [
    '@tikopays',
    '@tikopayfinanss'
].map(u => u.toLowerCase());

// 💰 DATABASE
let total = 0;
let count = 0;
let logs = [];

// 📩 MESAJ YAKALA
bot.on('text', (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // ❌ izinli değilse çık
    if (!allowedUsers.includes(user)) {

        // SAY kontrolü yine de çalışabilsin diye burada bırakıyoruz
        if (text === 'say') {

            if (!allowedSayUsers.includes(user)) return;

            ctx.reply(
                `📊 GRUP RAPOR\n\n` +
                `💰 TOPLAM: ${total} TL\n` +
                `📌 İŞLEM SAYISI: ${count}`
            );
        }

        return;
    }

    // 📊 SAY KOMUTU (yetkili kişiler)
    if (text === 'say') {

        if (!allowedSayUsers.includes(user)) return;

        ctx.reply(
            `📊 GRUP RAPOR\n\n` +
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

    // duplicate engel
    const msgId = ctx.message.message_id;
    if (logs.includes(msgId)) return;
    logs.push(msgId);

    total += amount;
    count++;

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');