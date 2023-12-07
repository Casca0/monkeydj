import 'dotenv/config';
import { Client, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { CommandKit } from 'commandkit';
import {
	CommandsPath,
	EventsPath,
	ValidationsPath,
} from '#bot/utils/constants';
import { registerPlayerEvents } from '#bot/player/registerEvents';
import express from 'express';

const client = new Client({
	intents: ['Guilds', 'GuildVoiceStates', 'GuildMembers', 'DirectMessages'],
	partials: [Partials.GuildMember, Partials.User],
});

const player = new Player(client, {
	skipFFmpeg: false,
	connectionTimeout: 60000 * 10,
	ytdlOptions: {
		highWaterMark: 1 << 25,
		quality: 'highestaudio',
	},
});

new CommandKit({
	client,
	bulkRegister: false,
	commandsPath: CommandsPath,
	eventsPath: EventsPath,
	skipBuiltInValidations: true,
	validationsPath: ValidationsPath,
});

await registerPlayerEvents();
await player.extractors.loadDefault();
await client.login();

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 8080;

app.listen(port, () => {
	console.log(`helloworld: listening on port ${port}`);
});
