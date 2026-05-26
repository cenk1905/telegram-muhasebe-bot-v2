const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5'
];

// RAM DATA
let total = 0;
let records = [];

// MESAJ
bot.on('text', (ctx) => {

    const text = ctx.message.text.toLowerCase();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username
        : '';

    // kullanıcı kontrol
    if (!allowedUsers.includes(user)) return;

    // SADECE REPLY
    if (!ctx.message.reply_to_message) return;

    // onay yoksa çık
    if (!text.includes('onay')) return;

    // sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    total += amount;

    records.push({
        user,
        amount,
        time: new Date().toLocaleString('tr-TR')
    });

    ctx.reply(`💰 ${amount} TL kaydedildi\n📊 Toplam: ${total} TL`);
});

// SAY
bot.hears('say', (ctx) => {
    ctx.reply(
        `📊 BUGÜN RAPOR\n\n` +
        `💰 TOPLAM: ${total} TL\n` +
        `📌 İŞLEM: ${records.length}`
    );
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');