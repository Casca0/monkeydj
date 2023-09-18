// Imports

require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Player } = require('discord-player/dist');
const { connect } = require('mongoose');

const { DISCORD_TOKEN, MONGO_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages], partials: [Partials.User, Partials.GuildMember] });

// Música

const player = Player.singleton(client, {
	connectionTimeout: 60000 * 10,
	smoothVolume: false,
	ytdlOptions: {
		highWaterMark: 1 << 25,
		quality: 'highestaudio',
	},
});

player.extractors.loadDefault();

// Manipulador de comandos

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);

	delete require.cache[require.resolve(filePath)];

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
		player.events.on(event.name, async (...args) => await event.execute(...args));
	}

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(DISCORD_TOKEN);

// Database

connect(MONGO_TOKEN, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Conectei ao banco de dados!');
}).catch((err) => {
	console.log(err);
});

// Server

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 8080;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

