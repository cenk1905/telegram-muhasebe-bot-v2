const { Telegraf } = require("telegraf");

const { GoogleSpreadsheet } = require("google-spreadsheet");

const { JWT } = require("google-auth-library");


// TOKEN ARTIK RAILWAY'DEN GELECEK
const bot = new Telegraf(process.env.BOT_TOKEN);


// GOOGLE JSON
const serviceAccount = require("./telegram-muhasebe-bot-8c7fcd0a75ba.json")

// GOOGLE SHEET ID
const SHEET_ID = "1i2bt89YV7-6oCPZ3rF_Ed0hxd0FnHNmS8bH_h7dPj7g";


// İzin verilen kullanıcılar
const allowedUsers = [
  "vertexfinans",
  "finans_admin34",
  "donciccio5",
  "soyluuu"
];


// Aynı işlem tekrar sayılmasın
const processedTransactions = new Set();


// GOOGLE AUTH
const serviceAccountAuth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});


// SHEET BAĞLANTISI
const doc = new GoogleSpreadsheet(
  SHEET_ID,
  serviceAccountAuth
);


// SAY KOMUTU
bot.hears("say", async (ctx) => {

  ctx.reply(
    "📊 BUGÜN TOPLAMI HESAPLANIYOR..."
  );

});


// MESAJLARI DİNLE
bot.on("text", async (ctx) => {

  const username = ctx.from.username;
  const message = ctx.message.text.toLowerCase();

  // Kullanıcı kontrolü
  if (!allowedUsers.includes(username)) {
    return;
  }

  // Reply kontrolü
  if (!ctx.message.reply_to_message) {
    return;
  }

  // ONAY kontrolü
  if (!message.includes("onay")) {
    return;
  }

  let amount = 0;
  let processNo = "-";

  // FORMAT:
  // 113-1000t onay
  // 87- 700t onay
  // 86-500 t onay
  const dashFormat = message.match(
    /^(\d+)\s*-\s*(\d+(?:[.,]\d+)?)/i
  );

  if (dashFormat) {

    processNo = dashFormat[1];

    amount = parseFloat(
      dashFormat[2].replace(",", ".")
    );

  } else {

    const normalFormat = message.match(
      /(\d+(?:[.,]\d+)?)/
    );

    if (!normalFormat) {

      ctx.reply(
        "❌ Tutar bulunamadı."
      );

      return;
    }

    amount = parseFloat(
      normalFormat[1].replace(",", ".")
    );

  }

  // Aynı işlem tekrar sayılmasın
  if (processedTransactions.has(processNo)) {

    ctx.reply(
      "⚠️ Bu işlem zaten sayılmış."
    );

    return;
  }

  processedTransactions.add(processNo);

  // Tarih saat
  const now = new Date();

  const date =
    now.toLocaleDateString("tr-TR");

  const time =
    now.toLocaleTimeString("tr-TR");


  // GOOGLE SHEETS'E YAZ
  try {

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Tarih: date,
      Saat: time,
      "Kullanıcı": username,
      "İşlemNo": processNo,
      Tutar: amount
    });

  } catch (error) {

    console.log(
      "GOOGLE SHEETS HATASI:",
      error
    );

  }

  // Terminal log
  console.log(
    `ONAY -> ${username} | ${amount} TL`
  );

  // Telegram cevabı
  ctx.reply(
    `✅ ${amount} TL kaydedildi`
  );

});


bot.launch();

console.log("BOT ÇALIŞIYOR...");