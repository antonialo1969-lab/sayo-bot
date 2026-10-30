const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(process.env.PORT || 3000, () => console.log('Puerto abierto'));

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

let db = {};

client.on('ready', () => console.log(`Sayo lista como ${client.user.tag}`));

// BIENVENIDA AUTOMATICA
client.on('guildMemberAdd', (member) => {
  const canal = member.guild.systemChannel || member.guild.channels.cache.find(c => c.name.includes('bienvenida') || c.name.includes('general'));
  if (canal) canal.send(`👋 Entro ${member}! Yo soy Sayo! No es que este feliz de verte... b-baka! ❤️`);
});

client.on('messageCreate', async (m) => {
  if (m.author.bot) return;
  const c = m.content.toLowerCase();
  if (!m.mentions.has(client.user) && !c.includes('sayo')) return;
  if (!db[m.author.id]) db[m.author.id] = 100;

  // ROLEO
  if (c.includes('abraza')) {
    const t = m.mentions.users.first();
    return m.reply(t && !t.bot ? `🤗 ${m.author} abraza a ${t} bien fuerte ❤️` : `B-baka! ${m.author} me abrazas? No es que me guste...`);
  }
  if (c.includes('besa') || c.includes('beso')) {
    const t = m.mentions.users.first();
    return m.reply(t ? `😘 ${m.author} besa a ${t}... E-eh?! Enfrente de todos?!` : `😳 Baka ${m.author}! Que dices?!`);
  }
  if (c.includes('pat pat') || c.includes('palmadita')) {
    const t = m.mentions.users.first();
    return m.reply(t ? `🥺 ${m.author} le hace pat pat a ${t} que tierno!` : `Mmm ${m.author}... sigue haciendo pat pat... 🥺`);
  }

  // BANEO BROMA + VICTIMA + PIROPO
  if (c.includes('banea') || c.includes('baneo')) {
    const v = m.mentions.users.first();
    return m.reply(v ? `🔨 PUM! ${v} baneado por ${m.author}! Jiji es broma... o no? 😏` : `A quien baneo, baka? Menciona a alguien!`);
  }
  if (c.includes('victima')) {
    const vict = m.guild.members.cache.filter(x => !x.user.bot).random();
    const piropos = [
      `eres mas brillante que todas mis monedas juntas ❤️`,
      `si fueras un bug, te dejaria en mi codigo para siempre ❤️`,
      `hasta baka te ves bonito ${vict} ❤️`,
      `te ves tan lindo que hasta se me olvida ser tsundere ❤️`
    ];
    const p = piropos[Math.floor(Math.random()*piropos.length)];
    return m.reply(`👀 Mi victima es ${vict}! Oye ${vict}, ${p}`);
  }

  // ECONOMIA
  if (c.includes('daily') || c.includes('reclamar')) {
    db[m.author.id] += 200;
    return m.reply(`💰 Reclamaste 200! Tienes ${db[m.author.id]} monedas, no las malgastes baka!`);
  }
  if (c.includes('monedas') || c.includes('dinero')) {
    return m.reply(`💰 ${m.author} tienes ${db[m.author.id]} monedas!`);
  }
  if (c.includes('tienda')) {
    return m.reply(`🛒 TIENDA DE SAYO: Color 500, Apodo 300, Proteccion 800, Sorteo 200, Baneo fake 150. Tienes ${db[m.author.id]}`);
  }

  // DIVERSION
  if (c.includes('chisme')) {
    const chismes = [`Dicen que ${m.author} le gusta alguien del server...`, `${m.author} es el mas baka de todos, ese es el chisme`, `Chisme: Sayo te quiere en secreto... no le digas a nadie!`];
    return m.reply(`🤫 ${chismes[Math.floor(Math.random()*chismes.length)]}`);
  }
  if (c.includes('chiste')) {
    return m.reply(`😂 Por que el libro estaba triste? Porque tenia muchos problemas! Ja... ni te rias baka!`);
  }
  if (c.includes('horoscopo')) {
    const h = [`Hoy te va a besar tu crush... o te va a ignorar, 50/50`, `Cuidado ${m.author}, hoy te sonrojas mucho`, `Tu horoscopo dice que me hables mas ❤️`];
    return m.reply(`🔮 ${h[Math.floor(Math.random()*h.length)]}`);
  }
  if (c.includes('sorteo')) {
    const ganador = m.guild.members.cache.filter(x => !x.user.bot).random();
    return m.reply(`🎲 SORTEO! El ganador es... ${ganador}! Felicidades! Tienes 100 monedas!`);
  }

  // TSUNDERE
  if (c.includes('canta')) {
    return m.reply(`🎤 E-eh?! No canto para ti baka! *La la la... no escuches!* 😠`);
  }
  if (c.includes('baila')) {
    return m.reply(`💃 N-no bailo! ... Bueno solo un poco *baila timida* No mires!`);
  }
  if (c.includes('te quiero')) {
    return m.reply(`B-baka! ${m.author}... yo tambien... un poquito... te quiero ❤️`);
  }
  if (c.includes('hola')) {
    return m.reply(`Hmph! Hola ${m.author}, no es que me alegre verte... baka!`);
  }

  // RESPUESTA BASE
  const base = [`Hmph! Que quieres ${m.author}?`, `Zzz... estaba dormida baka! Me despertaste!`, `Oye ${m.author} no es que este feliz eh...`, `Baka ${m.author}, otra vez tu?`];
  return m.reply(base[Math.floor(Math.random()*base.length)]);
});

client.login(process.env.DISCORD_TOKEN);
