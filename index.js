require('dotenv').config();

const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

const bot = new Telegraf(process.env.BOT_TOKEN);

/* MONGO */
mongoose.connect(process.env.mongo)
  .then(() => console.log("MongoDB connected ✔"))
  .catch(err => console.log("Mongo error:", err));

/* USERS */
const allowedUsers = [
  '@vertexfinans',
  '@finans_admin34',
  '@donciccio5',
  '@soyluuu',
  '@tikopayfinanss'
];

/* MODEL */
const Log = mongoose.model('Log', new mongoose.Schema({
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now }
}));

/* MESSAGE SAFE HANDLER */
bot.on('text', async (ctx) => {
  try {

    if (!ctx.message) return;

    const text = (ctx.message.text || '').toLowerCase();
    const user = ctx.from?.username ? '@' + ctx.from.username : '';

    if (!allowedUsers.includes(user)) return;
    if (!ctx.message.reply_to_message) return;
    if (!text.includes('onay')) return;

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

/* SAY */
bot.hears('say', async (ctx) => {
  try {

    const today = new Date();
    today.setHours(0,0,0,0);

    const logs = await Log.find({ date: { $gte: today } });

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