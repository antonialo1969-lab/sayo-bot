const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.Channel]
});

let monedasDB = {}; // En memoria, si quieres que guarde para siempre luego le ponemos base de datos

client.on('ready', () => {
  console.log(`Sayo viva! ❤️ Logueada como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user) && !message.content.toLowerCase().includes('sayo')) return;

  const contenido = message.content.toLowerCase();
  const args = message.content.split(' ');
  const user = message.author;

  if (!monedasDB[user.id]) monedasDB[user.id] = 100;

  // --- LLAMAR ADMINS (DE VUELTA) ---
  if (contenido.includes('admins') || contenido.includes('llama') || contenido.includes('moderador')) {
    if (contenido.includes('admin')) {
      const rol = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('admin') || r.name.toLowerCase().includes('mod'));
      if (rol) {
        return message.reply(`🚨 ${rol} ¡Los necesitan! Llamado por ${message.author} 🚨`);
      } else {
        const admins = message.guild.members.cache.filter(m => m.permissions.has('Administrator') && !m.user.bot).map(m => m.toString()).slice(0,5);
        if (admins.length > 0) return message.reply(`🚨 ${admins.join(' ')} ¡${message.author} necesita ayuda! 🚨`);
        return message.reply(`😅 ${message.author} no encontré rol de Admin, crea uno llamado Admin`);
      }
    }
  }

  // --- TIENDA NUEVA SIN NOVIOS ---
  if (contenido.includes('tienda')) {
    return message.reply(`🛒 **TIENDA DE SAYO** 🛒
🎨 Cambio de color - 500 monedas -> \`@Sayo comprar color\`
😜 Cambio de apodo - 300 monedas -> \`@Sayo comprar apodo\`
🛡️ Protección anti-víctima 24h - 800 monedas -> \`@Sayo comprar proteccion\`
🎲 Sorteo extra - 200 monedas -> \`@Sayo comprar sorteo\`
💥 Baneo fake premium - 150 monedas -> \`@Sayo comprar baneo @user\`

💰 Tienes: ${monedasDB[user.id]} monedas`);
  }

  if (contenido.includes('daily') || contenido.includes('reclamar')) {
    monedasDB[user.id] += 200;
    return message.reply(`💰 ${user} reclamaste 200 monedas! Ahora tienes ${monedasDB[user.id]}`);
  }

  if (contenido.includes('monedas') || contenido.includes('dinero')) {
    return message.reply(`💰 ${user} tienes ${monedasDB[user.id]} monedas`);
  }

  // --- ROLEO ---
  if (contenido.includes('abraza')) {
    const target = message.mentions.users.first() && !message.mentions.users.first().bot ? message.mentions.users.first() : null;
    return message.reply(target ? `🤗 ${user} abraza a ${target} con mucho amor ❤️` : `🤗 ${user} me abraza... b-baka! No es que me guste! ❤️`);
  }
  if (contenido.includes('besa') || contenido.includes('beso')) {
    const target = message.mentions.users.first();
    return message.reply(target && target.id !== client.user.id ? `😘 ${user} besa a ${target} 💋` : `😳 b-baka! ${user}...`);
  }
  if (contenido.includes('pat pat')) {
    return message.reply(`🥺 *pat pat* a ${user}... eres bueno a veces`);
  }

  // --- DIVERSIÓN ---
  if (contenido.includes('banea')) {
    const victima = message.mentions.users.first();
    return message.reply(victima ? `🔨 ¡PUM! ${victima} fue baneado por ${user} (es broma w) 😂` : `🔨 ${user} quiere banear al aire`);
  }
  if (contenido.includes('victima') || contenido.includes('elige')) {
    const miembros = message.guild.members.cache.filter(m => !m.user.bot).random();
    return message.reply(`👀 Mi víctima es... ¡${miembros}! Corre! 🏃‍♀️`);
  }
  if (contenido.includes('juego')) {
    return message.reply(`❤️ Comandos: @Sayo abraza, besa, pat pat, banea, victima, daily, monedas, tienda, admins, chisme, chiste`);
  }

  // --- TSUNDERE DEFAULT ---
  const respuestas = [
    `Hmph... ${user} ¿qué quieres? Baka!`,
    `${user} me hablaste? No es que esté feliz eh...`,
    `O-oye ${user}... ¿estás bien? No me importas!`,
    `Zzz... eh? ${user} me despertaste!`
  ];
  return message.reply(respuestas[Math.floor(Math.random()*respuestas.length)]);
});

client.on('guildMemberAdd', member => {
  const canal = member.guild.systemChannel || member.guild.channels.cache.find(c => c.name.includes('bienvenida') || c.name.includes('general'));
  if (canal) canal.send(`¡Bienvenido ${member}! Soy Sayo ❤️ Usa @Sayo juego para ver mis comandos`);
});

client.login(process.env.DISCORD_TOKEN);
