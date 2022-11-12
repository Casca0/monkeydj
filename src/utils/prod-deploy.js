require('dotenv/config');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const chalk = require('chalk');

const { clientId } = require('../config.json');
const token = process.env['DISCORD_TOKEN'];

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log(chalk.bgGreen('Comandos registrados em produção: ') + chalk.cyan(commands.length)))
	.catch(console.error);

// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log(chalk.red('Comandos registrados em produção deletados!')))
// 	.catch(console.error);
