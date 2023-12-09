/* eslint-disable no-undef */
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const { DISCORD_TOKEN, CLIENT_ID } = process.env;


const rest = new REST({ version: 10 }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
	.then(() => console.log('Comandos deletados.'))
	.catch(console.error);
