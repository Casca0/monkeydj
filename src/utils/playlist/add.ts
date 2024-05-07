import type { SlashCommandProps } from 'commandkit';
import { playlistModel } from '#bot/schemas/Playlist.Schema';
import { useMainPlayer, serialize, Track, SerializedTrack } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export async function handlePlaylistAdd({ interaction }: SlashCommandProps) {
	const player = useMainPlayer();
	const query = interaction.options.getString('query', true);
	const playlistName = interaction.options.getString('sua_playlist', true);

	const playlist = await playlistModel.findOne({
		playlist_name: playlistName,
	});

	if (!playlist) return interaction.reply('Não encontrei a playlist');

	await interaction.deferReply();

	const result = await player.search(query, {
		searchEngine: 'auto',
		requestedBy: interaction.user,
	});

	if (!result.tracks.length) return interaction.editReply('Não encontrei a música ou playlist informada.');

	if (result.playlist) {
		const serializedTracks: SerializedTrack[] = result.playlist.tracks.map(
			(track: Track) => serialize(track)
		);

		playlist.playlist_tracks.push(...serializedTracks);
		playlist.save();

		const embed = new EmbedBuilder({
			title: 'Músicas adicionadas à playlist',
			description: `**[${result.playlist!.title}](${result.playlist!.url}) - ${
				result.tracks.length
			} músicas**`,
			thumbnail: {
				url: result.playlist!.thumbnail,
			},
			color: 0x42f5ad,
		});

		return interaction.editReply({ embeds: [embed] });
	} else {
		const serializedTrack: SerializedTrack = serialize(result.tracks[0]);

		playlist.playlist_tracks.push(serializedTrack);
		playlist.save();

		const embed = new EmbedBuilder({
			title: 'Música adicionada à playlist',
			description: `**[${result.tracks[0].title}](${result.tracks[0].url}) - ${result.tracks[0].author}**`,
			thumbnail: {
				url: result.tracks[0].thumbnail,
			},
			color: 0x42f5ad,
		});

		return interaction.editReply({ embeds: [embed] });
	}
}
