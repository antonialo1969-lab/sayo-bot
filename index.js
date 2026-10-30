const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(process.env.PORT || 3000, () => {
  console.log('Puerto abierto');
});

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.Channel]
});

let db = {};

client.on('ready', () => {
  console.log(`Sayo viva! Como ${client.user.tag}`);
});

client.on('messageCreate', async (m) => {
  if (m.author.bot) return;
  const c = m.content.toLowerCase();
  if (!m.mentions.has(client.user) && !c.includes('sayo')) return;
  if (!db[m.author.id]) db[m.author.id] = 100;

  // --- PERSONALIDAD Y JUEGOS ---

  if (c.includes('abraza')) {
    const t = m.mentions.users.first();
    return m.reply(t && !t.bot ? `🤗 ${m.author} abraza a ${t}... no miren!` : `B-baka! ${m.author} me abrazas? No es que me guste...`);
  }
  if (c.includes('besa') || c.includes('beso')) {
    return m.reply(`E-eh?! ${m.author} baka pervertido! 😳`);
  }
  if (c.includes('pat pat') || c.includes('cariño')) {
    return m.reply(`Mmm... ${m.author} sigue... solo un poco mas... 🥺`);
  }
  if (c.includes('banea') || c.includes('baneo')) {
    const v = m.mentions.users.first();
    return m.reply(v ? `🔨 PUM! ${v} fue baneado por ${m.author}! Es broma tonto, no puedo... o si? 😏` : `A quien quieres banear, baka?`);
  }
  if (c.includes('victima') || c.includes('elige') || c.includes('elige a alguien')) {
    const vict = m.guild.members.cache.filter(x => !x.user.bot).random();
    return m.reply(`Jiji... mi victima es... ¡${vict}! Corre ${vict}, ${m.author} te quiere! 😈`);
  }
  if (c.includes('chiste') || c.includes('broma')) {
    return m.reply(`Ok ${m.author}... Por que el libro de matematicas estaba triste? Porque tenia muchos problemas! Ja... no te rias tanto baka!`);
  }
  if (c.includes('8ball') || c.includes('pregunta')) {
    const r = ['Si, obvio baka', 'No, ni lo intentes', 'Tal vez... si me abrazas', 'Definitivamente no', 'Preguntale a otro!'];
    return m.reply(`🎱 ${r[Math.floor(Math.random()*r.length)]}`);
  }

  // --- MONEDAS SIMPLE ---
  if (c.includes('tienda')) {
    return m.reply(`🛒 Mi tiendita: Color 500, Apodo 300, Baneo fake 150. Tienes ${db[m.author.id]} monedas`);
  }
  if (c.includes('daily') || c.includes('monedas')) {
    db[m.author.id] += 50;
    return m.reply(`💰 ${m.author} tienes ${db[m.author.id]} monedas! Te di 50 por hablarme... no es que quiera verte feliz eh!`);
  }

  // --- RESPUESTAS BASE TSUNDERE ---
  const respuestas = [
    `Hmph! Que quieres ahora ${m.author}? Baka!`,
    `No estoy aqui para ti eh ${m.author}... solo pasaba`,
    `O-oye ${m.author}... estas bien? No es que me importe!`,
    `Zzz... eh? ${m.author} me despertaste baka!`,
    `${m.author}? De nuevo tu? Que pesado...`,
    `Si me sigues hablando me voy a sonrojar... BAKA!`
  ];
  return m.reply(respuestas[Math.floor(Math.random()*respuestas.length)]);
});

client.login(process.env.DISCORD_TOKEN);
