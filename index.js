const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✔ izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
].map(u => u.toLowerCase());

// 💰 RAM DATABASE
let total = 0;
let records = [];

// 📩 MESAJ KONTROL
bot.on('text', (ctx) => {

    const text = ctx.message.text.toLowerCase();

    // kullanıcı adı fix
    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '@' + ctx.message.from.first_name.toLowerCase();

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

    const now = new Date();
    const date = now.toLocaleDateString('tr-TR');
    const time = now.toLocaleTimeString('tr-TR');

    total += amount;

    records.push({
        user,
        amount,
        date,
        time
    });

    ctx.reply(`👤 ${user} → 💰 ${amount} TL onaylandı\n📊 Toplam: ${total} TL`);
});

// 📊 SAY KOMUTU
bot.hears('say', (ctx) => {
    ctx.reply(
        `📊 BUGÜN RAPOR\n\n` +
        `💰 TOPLAM: ${total} TL\n` +
        `📌 İŞLEM SAYISI: ${records.length}`
    );
});

// ♻ RESET (opsiyonel)
bot.hears('reset', (ctx) => {
    total = 0;
    records = [];
    ctx.reply('♻ Sistem sıfırlandı');
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');