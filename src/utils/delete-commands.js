require('dotenv/config');
const { REST, Routes } = require('discord.js');

// eslint-disable-next-line no-unused-vars
const { DISCORD_TOKEN, CLIENT_ID, DISCORD_PROD_TOKEN, PROD_CLIENT_ID } = process.env;

const rest = new REST().setToken(DISCORD_PROD_TOKEN);

rest.put(Routes.applicationCommands(PROD_CLIENT_ID), { body: [] })
	.then(() => console.log('Comandos deletados.'))
	.catch(console.error);
