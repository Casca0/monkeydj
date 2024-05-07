import 'dotenv/config';
import { Client, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { SpotifyExtractor, YoutubeExtractor } from '@discord-player/extractor';
import { CommandKit } from 'commandkit';
import {
	CommandsPath,
	EventsPath,
	ValidationsPath,
} from '#bot/utils/constants';
import { registerPlayerEvents } from '#bot/player/registerEvents';
import express from 'express';
import { connect } from 'mongoose';

const client = new Client({
	intents: ['Guilds', 'GuildVoiceStates', 'GuildMembers', 'DirectMessages'],
	partials: [Partials.GuildMember, Partials.User],
});

const player = new Player(client, {
	skipFFmpeg: true,
	connectionTimeout: 60000 * 10,
	ytdlOptions: {
		highWaterMark: 1 << 60,
		quality: 'lowestaudio',
	},
});

new CommandKit({
	client,
	bulkRegister: true,
	commandsPath: CommandsPath,
	eventsPath: EventsPath,
	skipBuiltInValidations: true,
	validationsPath: ValidationsPath,
});

await registerPlayerEvents();

await player.extractors.register(SpotifyExtractor, {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

await player.extractors.register(YoutubeExtractor, {});

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

connect(process.env.MONGO_TOKEN as string).then(() => {
	console.log('Conectei ao banco de dados!');
}).catch((err) => {
	console.log(err);
});
