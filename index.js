const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Sayo está online ✨ como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  await interaction.deferReply();

  const comando = interaction.commandName;
  const texto = interaction.options.getString('texto') || 'hola';

  let respuesta = '';

  if (comando === 'say') {
    respuesta = `¡Hola! ${texto} 🤗💖`;
  } else if (comando === 'hola') {
    respuesta = `¡Hola! Estoy dibujando mi dibujo de mi gato imaginario, ¡se llama Pompón y le gusta saltar sobre la luna! ✨👀`;
  } else {
    respuesta = `¡Qué bien que volviste! ¡Te extrañé mucho, jiji! ¡Vamos a jugar y hacer travesuras juntas! ✨👀`;
  }

  await interaction.editReply(respuesta);
});

client.on('messageCreate', msg => {
  if (msg.author.bot) return;
  if (msg.mentions.has(client.user)) {
    msg.reply(`¡Qué bien que volviste! ¡Te extrañé mucho, jiji! ¡Vamos a jugar y hacer travesuras juntas! ✨`);
  }
});

client.login(process.env.TOKEN);
