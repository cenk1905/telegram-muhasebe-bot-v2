const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5'
];

// RAM DATABASE
let total = 0;
let records = [];

// MESAJ KONTROL
bot.on('text', (ctx) => {

    const text = ctx.message.text.toLowerCase();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username
        : '';

    // kullanıcı kontrol
    if (!allowedUsers.includes(user)) return;

    // reply kontrol
    if (!ctx.message.reply_to_message) return;

    // onay kontrol
    if (!text.includes('onay')) return;

    // sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    const now = new Date();
    const date = now.toLocaleDateString('tr-TR');
    const time = now.toLocaleTimeString('tr-TR');

    total += amount;

    // kayıt
    records.push({
        date,
        time,
        user,
        amount
    });

    ctx.reply(`💰 ${amount} TL kaydedildi\n📊 Toplam: ${total} TL`);
});

// SAY KOMUTU
bot.hears('say', (ctx) => {

    ctx.reply(
        `📊 BUGÜN RAPOR\n\n` +
        `💰 TOPLAM: ${total} TL\n` +
        `📌 İŞLEM SAYISI: ${records.length}`
    );
});

// RESET (opsiyonel)
bot.hears('reset', (ctx) => {
    total = 0;
    records = [];
    ctx.reply('♻ Sistem sıfırlandı');
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀'); 