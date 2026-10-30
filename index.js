const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`¡Sayo lista como ${client.user.tag}! 💖`);
});

// BIENVENIDAS
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const { default: SayoHandler } = await import('./sayo.js');
    const handler = new SayoHandler();
    const channel = member.guild.systemChannel || member.guild.channels.cache.find(c => c.name.includes('bienvenida') || c.name.includes('general'));
    if (channel) channel.send(handler.getWelcomeMessage(member));
  } catch(e) { console.log(e) }
});

// MENCIONES @Sayo
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  try {
    const { default: SayoHandler } = await import('./sayo.js');
    const handler = new SayoHandler();
    const reply = await handler.handle(message);
    await message.reply(reply);
  } catch(e) { console.log(e) }
});

client.login(process.env.DISCORD_TOKEN);
