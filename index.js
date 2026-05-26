const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✔ ONAY atabilecek kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
].map(u => u.toLowerCase());

// ✔ SAY yazabilecek kullanıcılar
const allowedSayUsers = [
    '@tikopays',
    '@tikopayfinanss'
].map(u => u.toLowerCase());

// 💰 DATABASE
let logs = [];

// 📅 bugün mü kontrol
function isToday(date) {
    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

// 📩 MESAJ YAKALA
bot.on('text', (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // 📊 SAY KOMUTU
    if (text === 'say') {

        if (!allowedSayUsers.includes(user)) return;

        let dailyTotal = 0;
        let dailyCount = 0;

        logs.forEach(item => {
            if (isToday(item.time)) {
                dailyTotal += item.amount;
                dailyCount++;
            }
        });

        ctx.reply(
            `📊 BUGÜN RAPOR (00:01 - 23:59)\n\n` +
            `💰 TOPLAM: ${dailyTotal} TL\n` +
            `📌 İŞLEM SAYISI: ${dailyCount}`
        );

        return;
    }

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

    logs.push({
        user,
        amount,
        time: new Date()
    });

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');