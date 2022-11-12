require('dotenv/config');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

const { devGuildId, clientId } = require('../config.json');
const token = process.env['DISCORD_TOKEN'];

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: 10 }).setToken(token);

rest.put(
	Routes.applicationGuildCommands(clientId, devGuildId),
	{ body: commands },
)
	.then(() => console.log(chalk.greenBright('Comandos registrados em desenvolvimento: ') + chalk.cyan(commands.length)))
	.catch(console.error);

// rest.put(Routes.applicationGuildCommands(clientId, devGuildId), { body: [] })
// 	.then(() => console.log(chalk.red('Comandos registrados em desenvolvimento deletados!')))
// 	.catch(console.error);
