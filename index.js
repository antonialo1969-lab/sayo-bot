const http = require('http');
http.createServer((req,res)=>res.end('Sayo esta online')).listen(process.env.PORT || 10000);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Sayo lista como ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.toLowerCase().includes('sayo')) {
    msg.reply('Holaa, soy Sayo 💜 ¿en qué te ayudo?');
  }
});

client.login(process.env.BOT_TOKEN);
