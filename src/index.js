// Imports

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Player } = require('discord-player');

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Música

const player = new Player(client, {
	ytdlOptions: {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
		dlChunkSize: 0,
	},
});

// Manipulador de comandos

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

// Manipulador de eventos

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.music) {
		player.events.on(event.name, (...args) => event.execute(...args));
	}

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client, player));
	}
}

client.login(token);

// Server

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 8080;
app.listen(port, () => {
	console.log(`helloworld: listening on port ${port}`);
});

