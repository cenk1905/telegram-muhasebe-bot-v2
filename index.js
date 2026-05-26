require('dotenv').config();

const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

/* ================== BOT ================== */
const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================== MONGODB ================== */
mongoose.connect(process.env.mongo)
  .then(() => console.log("MongoDB connected ✔"))
  .catch(err => console.log("Mongo Error:", err));

/* ================== ALLOWED USERS ================== */
const allowedUsers = [
  '@vertexfinans',
  '@finans_admin34',
  '@donciccio5',
  '@soyluuu',
  '@tikopayfinanss'
];

/* ================== LOG MODEL ================== */
const LogSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', LogSchema);

/* ================== MESSAGE HANDLER ================== */
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const user = ctx.from.username ? '@' + ctx.from.username : '';

  if (!allowedUsers.includes(user)) return;
  if (!ctx.message.reply_to_message) return;
  if (!text.includes('onay')) return;

  const numbers = text.match(/\d+/g);
  if (!numbers) return;

  const amount = Math.max(...numbers.map(Number));

  await Log.create({
    user,
    amount
  });

  await ctx.reply(`💰 ${amount} TL kaydedildi ✔`);
});

/* ================== SAY COMMAND ================== */
bot.hears('say', async (ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await Log.find({ date: { $gte: today } });

  const total = logs.reduce((sum, l) => sum + l.amount, 0);

  await ctx.reply(`📊 BUGÜN TOPLAM\n💰 ${total} TL\n📌 Adet: ${logs.length}`);
});

/* ================== START ================== */
bot.launch();
console.log("BOT ÇALIŞIYOR 🚀");