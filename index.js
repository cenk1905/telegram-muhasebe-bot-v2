require('dotenv').config();

const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

/* ================= BOT ================= */
const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= MONGO ================= */
mongoose.connect(process.env.mongo)
  .then(() => console.log("MongoDB connected ✔"))
  .catch(err => console.log("Mongo Error:", err));

/* ================= ALLOWED USERS ================= */
const allowedUsers = [
  '@vertexfinans',
  '@finans_admin34',
  '@donciccio5',
  '@soyluuu',
  '@tikopayfinanss'
];

/* ================= LOG MODEL ================= */
const logSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

/* ================= MESSAGE HANDLER ================= */
bot.on('text', async (ctx) => {

  const text = ctx.message.text.toLowerCase();
  const user = ctx.from.username ? '@' + ctx.from.username : '';

  // izin kontrolü
  if (!allowedUsers.includes(user)) return;

  // reply zorunlu
  if (!ctx.message.reply_to_message) return;

  // onay kelimesi yoksa çık
  if (!text.includes('onay')) return;

  /* ================= PARSE LOGIC ================= */

  // onaydan önceki kısmı al
  const beforeOnay = text.split('onay')[0];

  // sayıları bul
  const numbers = beforeOnay.match(/\d+/g);
  if (!numbers) return;

  // SON SAYIYI AL (en kritik fix)
  const amount = Number(numbers[numbers.length - 1]);

  /* ================= SAVE ================= */

  await Log.create({
    user,
    amount
  });

  await ctx.reply(`💰 ${amount} TL kaydedildi ✔`);
});

/* ================= SAY COMMAND ================= */
bot.hears('say', async (ctx) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await Log.find({ date: { $gte: today } });

  const total = logs.reduce((sum, l) => sum + l.amount, 0);

  await ctx.reply(
`📊 BUGÜN RAPOR
💰 Toplam: ${total} TL
📌 Adet: ${logs.length}`
  );
});

/* ================= START ================= */
