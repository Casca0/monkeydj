import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { writeFile } from 'fs';
import { AttachmentBuilder } from 'discord.js';
import { rimraf } from 'rimraf';

export async function handlePlaylistExtract({ interaction }: SlashCommandProps) {
	if (!interaction.inCachedGuild()) return;

	const playlistName = interaction.options.getString('playlist', true);

	const playlist = await playlistModel.findOne({ playlist_name: playlistName });

	if (!playlist) return interaction.reply('Não existe uma playlist com este nome.');

	await interaction.deferReply({ ephemeral: true });

	const mapPlaylist = playlist.playlist_tracks.map((track, index) => {
		return `${index + 1} - ${track.title} (${track.author}) - ${track.url}`;
	});

	writeFile('./playlist.txt', mapPlaylist.join('\n'), 'utf8', (err) => {
		if (err) throw err;
		console.log('Arquivo criado.');
	});

	await interaction.user.send({ files: [new AttachmentBuilder('./playlist.txt')] });

	await rimraf('./playlist.txt');

	return interaction.followUp({ content: 'Playlist extraída!', ephemeral: true });
}
