require('dotenv').config();

const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

<<<<<<< HEAD
const bot = new Telegraf(process.env.BOT_TOKEN);

/* MONGO */
=======
/* ================= BOT ================= */
const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= MONGO ================= */
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660
mongoose.connect(process.env.mongo)
  .then(() => console.log("MongoDB connected ✔"))
  .catch(err => console.log("Mongo error:", err));

<<<<<<< HEAD
/* USERS */
=======
/* ================= ALLOWED USERS ================= */
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660
const allowedUsers = [
  '@vertexfinans',
  '@finans_admin34',
  '@donciccio5',
  '@soyluuu',
  '@tikopayfinanss'
];

<<<<<<< HEAD
/* MODEL */
const Log = mongoose.model('Log', new mongoose.Schema({
=======
/* ================= LOG MODEL ================= */
const logSchema = new mongoose.Schema({
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now }
}));

<<<<<<< HEAD
/* MESSAGE SAFE HANDLER */
bot.on('text', async (ctx) => {
  try {

    if (!ctx.message) return;

    const text = (ctx.message.text || '').toLowerCase();
    const user = ctx.from?.username ? '@' + ctx.from.username : '';

    if (!allowedUsers.includes(user)) return;
    if (!ctx.message.reply_to_message) return;
    if (!text.includes('onay')) return;
=======
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
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660

    const beforeOnay = text.split('onay')[0];
    const numbers = beforeOnay.match(/\d+/g);

    if (!numbers) return;

    const amount = Number(numbers[numbers.length - 1]);

    await Log.create({ user, amount });

    await ctx.reply(`💰 ${amount} TL kaydedildi ✔`);

  } catch (err) {
    console.log("BOT ERROR:", err);
  }
});

<<<<<<< HEAD
/* SAY */
bot.hears('say', async (ctx) => {
  try {
=======
/* ================= SAY COMMAND ================= */
bot.hears('say', async (ctx) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660

    const today = new Date();
    today.setHours(0,0,0,0);

    const logs = await Log.find({ date: { $gte: today } });

<<<<<<< HEAD
    const total = logs.reduce((a,b) => a + b.amount, 0);

    await ctx.reply(
`📊 BUGÜN
💰 Toplam: ${total} TL
📌 Adet: ${logs.length}`
    );

  } catch (err) {
    console.log(err);
  }
});

bot.launch();
console.log("BOT ÇALIŞIYOR 🚀");
=======
  await ctx.reply(
`📊 BUGÜN RAPOR
💰 Toplam: ${total} TL
📌 Adet: ${logs.length}`
  );
});

/* ================= START ================= */
>>>>>>> a2a1865ddf7f23f86fd14910c08dc1db35026660
