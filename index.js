const { Telegraf } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const bot = new Telegraf(process.env.BOT_TOKEN);

// SADECE İZİNLİ KULLANICILAR
const allowedUsers = [
    '@vertexfinans',
    '@finans_admin34',
    '@donciccio5'
];

// GOOGLE SHEET
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

// SHEET BAĞLANTI (FIXED - YENİ METHOD)
async function initSheet() {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
}

initSheet();

// 📌 MESAJ KONTROL
bot.on('text', async (ctx) => {

    const text = ctx.message.text.toLowerCase();

    const user = ctx.message.from.username
        ? '@' + ctx.message.from.username
        : '';

    // ❌ izinli kullanıcı değilse çık
    if (!allowedUsers.includes(user)) return;

    // ❌ SADECE REPLY
    if (!ctx.message.reply_to_message) return;

    // ❌ "onay" yoksa çık
    if (!text.includes('onay')) return;

    // 📌 sayı çek
    const numbers = text.match(/\d+/g);
    if (!numbers) return;

    const amount = Math.max(...numbers.map(Number));

    const now = new Date();
    const date = now.toLocaleDateString('tr-TR');
    const time = now.toLocaleTimeString('tr-TR');

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
        Tarih: date,
        Saat: time,
        Kullanici: user,
        IslemNo: numbers[0],
        Tutar: amount
    });

    ctx.reply(`💰 ${amount} TL kaydedildi`);
});

// 📊 TOPLAM KOMUTU
bot.hears('say', async (ctx) => {

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    let total = 0;

    rows.forEach(r => {
        total += Number(r.Tutar || 0);
    });

    ctx.reply(`📊 BUGÜN TOPLAM\n💰 ${total} TL`);
});

bot.launch();

console.log('BOT ÇALIŞIYOR 🚀');