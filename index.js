// Imports - INÍCIO

require('dotenv/config');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { Player } = require('discord-player');

// Imports - FIM

process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, 'GuildVoiceStates'] });

// Música - INÍCIO

const player = new Player(client);

// Música - FIM

// Manipulador de comandos - INÍCIO

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

// Manipulador de comandos - FIM

// Manipulador de eventos - INÍCIO

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else if (event.music) {
		player.on(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, player));
	}
}

// Manipulador de eventos - FIM

// Server - INÍCIO

const http = require('http');
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end('ok');
});
server.listen(3000);

// Server - FIM

client.login();