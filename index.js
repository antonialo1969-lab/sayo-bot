const { Client, GatewayIntentBits, Events } = require('discord.js');
const express = require('express');

// --- SERVIDOR PARA QUE RENDER NO LA APAGUE (24/7) ---
const app = express();
app.get('/', (req, res) => res.send('Sayo está despierta 💖✨'));
app.listen(process.env.PORT || 3000, () => console.log('Web server para 24/7 ON'));
// ---

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Sayo COMPLETA activa como ${client.user.tag}! IA: ${process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY ? 'ON' : 'OFF (solo personalidad)'}`);
  client.user.setActivity('menciones @Sayo 💖', { type: 3 });
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const { default: SayoHandler } = await import('./sayo.js');
    const handler = new SayoHandler();
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(c => c.isTextBased());
    if (channel) channel.send(handler.getWelcomeMessage(member));
  } catch(e) { console.error(e) }
});

client.on(Events.GuildMemberRemove, async (member) => {
  try {
    const { default: SayoHandler } = await import('./sayo.js');
    const handler = new SayoHandler();
    const channel = member.guild.systemChannel;
    if (channel) channel.send(handler.getGoodbyeMessage(member));
  } catch(e) {}
});

// ESTA ES LA MAGIA DE LAS @MENCIONES
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  // Solo responde si la mencionan -> así se "apaga" sola y se prende cuando la llaman (ahorra recursos)
  if (!message.mentions.has(client.user)) return;
  
  try {
    await message.channel.sendTyping(); // Escribe como persona
    const { default: SayoHandler } = await import('./sayo.js');
    const handler = new SayoHandler();
    const reply = await handler.handle(message);
    await message.reply(reply);
  } catch(e) { console.error(e); message.reply('¡Ups! Me bugueé un poquito 💔 intenta de nuevo').catch(()=>{}) }
});

client.login(process.env.DISCORD_TOKEN);
