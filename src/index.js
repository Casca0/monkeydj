// Imports

require('dotenv').config();
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const extractors = require('@discord-player/extractor');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Player } = require('discord-player');

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers] });

// Música

console.log(ffmpeg.path, ffmpeg.version);

const player = Player.singleton(client, {
	smoothVolume: false,
	ytdlOptions: {
		lang: 'pt-br',
		filter: 'audioonly',
		quality: 'highest',
		highWaterMark: 1 << 80,
		dlChunkSize: 2,
	},
});

player.extractors.register(extractors.SoundCloudExtractor);
player.extractors.register(extractors.SpotifyExtractor);
player.extractors.register(extractors.YouTubeExtractor);

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
		client.on(event.name, (...args) => event.execute(...args, client));
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
	console.log(`listening on port ${port}`);
});

