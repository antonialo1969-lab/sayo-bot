// FIX PARA RENDER - NO BORRAR
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Sayo bot vivo'));
app.listen(process.env.PORT || 10000);

// CORRECCIÓN FINAL
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Sayo está online ✨ ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply({ ephemeral: true });

  const { default: SayoHandler } = await import('./sayo/sayo.js');
  const handler = new SayoHandler();
  const reply = await handler.handle(interaction);
  
  await interaction.editReply(reply);
});

client.login(process.env.DISCORD_TOKEN);
