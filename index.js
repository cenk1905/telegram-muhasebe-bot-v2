const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// izinli kullanıcılar
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5'
];

let total = 0;
let records = [];

bot.on('text', (ctx) => {

    const text = ctx.message.text.toLowerCase();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username
        : '';

    if (!allowedUsers.includes(user)) return;

    if (!ctx.message.reply_to_message) return;

    if (!text.includes('onay')) return;

    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    total += amount;

    records.push(amount);

    ctx.reply(`💰 ${amount} TL kaydedildi\n📊 TOPLAM: ${total} TL`);
});

bot.hears('say', (ctx) => {
    ctx.reply(`📊 TOPLAM: ${total} TL\n📌 İşlem: ${records.length}`);
});

bot.launch();

console.log("BOT ÇALIŞIYOR 🚀");
