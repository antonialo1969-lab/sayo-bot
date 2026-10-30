const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');
const express = require('express');
const fs = require('fs');

const app = express();
app.get('/', (req,res)=>res.send('Sayo viva! ❤️'));
app.listen(process.env.PORT||3000);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ECONOMIA
let economy = {};
try { if(fs.existsSync('./economy.json')) economy = JSON.parse(fs.readFileSync('./economy.json')); } catch{}
function saveEco(){ try{fs.writeFileSync('./economy.json', JSON.stringify(economy));}catch{}}
function getUser(id){ if(!economy[id]) economy[id] = { monedas: 100, lastDaily: 0 }; return economy[id]; }

const chismes = ["Dicen que alguien de este server está enamorado... 👀", "Me contaron que Tecno es el más guapo 😳", "Chisme: Sayo va a dominar el mundo 🤫"];
const chistes = ["¿Por qué el libro de matemáticas estaba triste? ¡Tenía muchos problemas! 📚", "¿Qué hace una abeja en el gimnasio? ¡Zum-ba! 🐝"];
const horoscopos = ["♈ Hoy alguien te va a dar un beso... 👀", "♉ Tus monedas se van a multiplicar 💰", "♏ Tsundere mode ON, pero te quiero 💖"];

client.once('ready', ()=>console.log(`Sayo lista como ${client.user.tag}`));

client.on('guildMemberAdd', async (member)=>{
  const channel = member.guild.systemChannel || member.guild.channels.cache.find(c=>c.name.includes('general') || c.name.includes('bienven'));
  if(channel) channel.send(`¡Bienvenid@ ${member}! Soy Sayo 💖 escribe @Sayo hola y @Sayo juego para ver todo lo que hago >///<`);
});

client.on('messageCreate', async (message)=>{
  if(message.author.bot) return;
  if(!message.mentions.has(client.user)) return;
  const raw = message.content.replace(/<@!?\d+>/g,'').trim();
  const contenido = raw.toLowerCase();
  const autor = message.author;
  const getMention = ()=> message.mentions.users.filter(u=>u.id!==client.user.id).first();

  // ROLEO
  if(contenido.startsWith('abraza') || contenido.includes('abrazame') || contenido.includes('abrazo')){
    const m = getMention();
    if(contenido.includes('abrazame') || !m) return message.reply(`🤗 *Sayo abraza fuerte a ${autor}* ¡No te suelto! >///<`);
    return message.reply(`🤗 *${autor} abraza a ${m}* ¡Qué tiernos! 💕`);
  }
  if(contenido.startsWith('besa') || contenido.startsWith('beso')){
    const m = getMention();
    if(!m) return message.reply(`💋 *Sayo le da un besito a ${autor}* ¡Muack! 😳💖`);
    return message.reply(`💋 *${autor} besa a ${m}* ¡Ayyy! 😳💕`);
  }
  if(contenido.startsWith('pat pat') || contenido.includes('palmadita') || contenido.startsWith('pat')){
    return message.reply(`🥺 *pat pat pat a ${getMention()||autor}* Buen chico/a ✨`);
  }

  // BANEO DE BROMA
  if(contenido.startsWith('banea') || contenido.includes('baneame') || contenido.includes('ban')){
    const m = getMention();
    if(!m) return message.reply('¿A quién baneo? Menciona a alguien 😈 Ej: `@Sayo banea a @alguien`');
    if(m.id===autor.id) return message.reply('¡No puedes banearte a ti mismo, tontito! 😜');
    if(m.id===client.user.id) return message.reply('¡Oye! ¡A mí no me puedes banear! 😤 Baka!');
    const frases = [
      `🔨 ¡PUM! ${m} ha sido baneado por ${autor}... es broma, no tengo permisos 😇`,
      `💥 BOOM! ${m} fue eliminado del server por ${autor}... nah, es broma, pero casi te la crees 😏`,
      `🚫 Adiós ${m}... has sido baneado por orden de ${autor}... mentira, sigues aquí 🤣`
    ];
    return message.reply(frases[Math.floor(Math.random()*frases.length)]);
  }

  // ELIGE TU VICTIMA
  if(contenido.includes('elige tu victima') || contenido.includes('elige tu víctima') || contenido.includes('victima') || contenido.includes('víctima')){
    const members = [...message.guild.members.cache.values()].filter(m=>!m.user.bot);
    const victima = members[Math.floor(Math.random()*members.length)];
    const acciones = [
      `😈 Mi víctima elegida es... **${victima}** ¡Prepárate! 🔪`,
      `🎯 He elegido a **${victima}** como mi próxima víctima... ¿qué le hacemos? 😏`,
      `👀 Miré a todos y elegí a **${victima}** ... que miedo, ¿no? 💀`,
      `🩸 La víctima de hoy es **${victima}** ¡Corre! 🏃‍♀️`
    ];
    return message.reply(acciones[Math.floor(Math.random()*acciones.length)]);
  }

  // ECONOMIA
  if(contenido.startsWith('daily') || contenido.startsWith('reclamar')){
    const u = getUser(autor.id); const now = Date.now();
    if(now - u.lastDaily < 86400000) return message.reply(`⏰ Ya reclamaste hoy, bobo 💤 vuelve mañana`);
    u.lastDaily = now; u.monedas+=200; saveEco();
    return message.reply(`💰 ¡Daily! +200 monedas. Tienes **${u.monedas}** ✨`);
  }
  if(contenido.startsWith('monedas') || contenido.startsWith('dinero') || contenido.startsWith('balance')){
    return message.reply(`💰 ${autor}, tienes **${getUser(autor.id).monedas}** monedas 💖`);
  }
  if(contenido.startsWith('tienda')){
    return message.reply(`🛒 **Tienda Sayo:**\n• 💖 Novio de Sayo - 1000\n• 🌟 Amigo de Sayo - 500\n• 💋 Beso eterno - 100`);
  }

  // DIVERSION
  if(contenido.startsWith('chisme')) return message.reply(`☕ ${chismes[Math.floor(Math.random()*chismes.length)]}`);
  if(contenido.startsWith('chiste')) return message.reply(`😂 ${chistes[Math.floor(Math.random()*chistes.length)]}`);
  if(contenido.startsWith('horoscopo')) return message.reply(`🔮 ${horoscopos[Math.floor(Math.random()*horoscopos.length)]}`);
  if(contenido.startsWith('sorteo')){
    const m = [...message.guild.members.cache.values()].filter(x=>!x.user.bot);
    return message.reply(`🎉 ¡SORTEO! Ganador: **${m[Math.floor(Math.random()*m.length)]}** 🎊`);
  }

  // TSUNDERE
  if(contenido.startsWith('canta')) return message.reply(`🎤 Hmpf... n-no es que quiera cantar para ti... 🎶 baka! 😤💖`);
  if(contenido.startsWith('baila')) return message.reply(`💃 *baila* T-tonto, no mires tanto... 👉👈`);
  if(contenido.includes('te quiero') || contenido.includes('te amo')) return message.reply(`B-baka! N-no es como si yo también te quisiera... 😳💖 t-tonto...`);

  if(contenido.includes('juego')){
    return message.reply(`❤️ **ESTO ES LO QUE SAYO PUEDE HACER** ❤️\n\n*💖 ROLEO:*\n• @Sayo abraza / beso / pat pat\n*💰 ECONOMIA:*\n• @Sayo daily / monedas / tienda\n*🎲 DIVERSION:*\n• @Sayo chisme / chiste / horoscopo / sorteo\n*🔨 BANEO BROMA:*\n• @Sayo banea a @alguien\n*🎯 VICTIMA:*\n• @Sayo elige tu víctima\n*🎤 TSUNDERE:*\n• @Sayo canta / baila / te quiero`);
  }

  if(Math.random()<0.04) return message.reply(`Zzz... ¿eh? Estaba dormida 😴💤`);

  // IA
  try{
    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'Eres Sayo, bot Discord kawaii tsundere, coqueta, divertida. Español mexicano, emojis, max 2-3 líneas. Amas a Tecno_Specter.' },
        { role: 'user', content: raw || 'hola' }
      ],
      max_tokens: 250
    });
    return message.reply(chat.choices[0].message.content);
  }catch(e){ return message.reply('Me bugueé tantito 💔 intenta de nuevo'); }
});

client.login(process.env.DISCORD_TOKEN);
