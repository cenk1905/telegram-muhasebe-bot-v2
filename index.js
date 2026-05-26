const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

const bot = new Telegraf(process.env.BOT_TOKEN);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected ✔'))
.catch(err => console.log('MongoDB error', err));

// ✔ SCHEMA
const logSchema = new mongoose.Schema({
    user: String,
    amount: Number,
    time: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

// ✔ izinli kullanıcılar (onay)
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5',
    '@soyluuu'
].map(u => u.toLowerCase());

// ✔ say yetkisi
const allowedSayUsers = [
    '@tikopays',
    '@tikopayfinanss'
].map(u => u.toLowerCase());

// 📅 bugün kontrol
function isToday(date) {
    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

// 📩 MESAJ
bot.on('text', async (ctx) => {

    if (ctx.from.is_bot) return;

    const text = ctx.message.text.toLowerCase().trim();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username.toLowerCase()
        : '';

    // 📊 SAY KOMUTU
    if (text === 'say') {

        if (!allowedSayUsers.includes(user)) return;

        const logs = await Log.find();

        let dailyTotal = 0;
        let dailyCount = 0;

        logs.forEach(item => {
            if (isToday(item.time)) {
                dailyTotal += item.amount;
                dailyCount++;
            }
        });

        ctx.reply(
            `📊 BUGÜN RAPOR\n\n` +
            `💰 TOPLAM: ${dailyTotal} TL\n` +
            `📌 İŞLEM SAYISI: ${dailyCount}`
        );

        return;
    }

    // ❌ izinli değil
    if (!allowedUsers.includes(user)) return;

    // ❌ reply yoksa çık
    if (!ctx.message.reply_to_message) return;

    // ❌ onay yoksa çık
    if (!text.includes('onay')) return;

    // 🔢 sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    // 💾 MongoDB kayıt
    await Log.create({
        user,
        amount,
        time: new Date()
    });

    ctx.reply(`💰 ${amount} TL kaydedildi ✔`);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');