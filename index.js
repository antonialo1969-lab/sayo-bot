const http = require('http');
http.createServer((req, res) => {
  res.write('Sayo esta online!');
  res.end();
}).listen(10000);

const { Client, GatewayIntentBits } = require('discord.js');
const cliente = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

cliente.on('ready', () => {
  console.log(`Lista como ${cliente.user.tag}`);
});

cliente.on('messageCreate', async (mensaje) => {
  if (mensaje.author.bot) return;
  if (mensaje.content.toLowerCase().includes('sayo')) {
    mensaje.reply('Holaa, soy Sayo 💖');
  }
});

cliente.login(process.env.TOKEN);
