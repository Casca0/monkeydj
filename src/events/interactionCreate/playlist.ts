import { Interaction } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { playlistModel } from '#bot/schemas/Playlist.Schema';

export default async function interactionCreate(interaction: Interaction) {
	if (!interaction.isAutocomplete() || interaction.commandName !== 'playlist') {
		return;
	}

	const focusedOption = interaction.options.getFocused(true);

	if (focusedOption.name === 'playlist') {
		const playlists = await playlistModel.find({ user_id: interaction.user.id });

		const results = playlists.slice(0, playlists.length).map((p) => ({
			name: p.playlist_name,
			value: p.playlist_name,
		}));

		await interaction.respond(
			results,
		);
	}

	if (focusedOption.name === 'playlists') {
		const user = interaction.options.get('membro', true).value;

		const playlists = await playlistModel.find({ user_id: user });

		const results = playlists.slice(0, playlists.length).map((p) => ({
			name: p.playlist_name,
			value: p.playlist_name,
		}));

		return interaction.respond(
			results,
		);
	}

	if (focusedOption.name === 'query') {
		const player = useMainPlayer();
		const query = interaction.options.getString('query', true);
		const results = await player.search(query, {
			searchEngine: 'youtubeSearch',
		});

		const tracks = results.tracks.slice(0, results.tracks.length).map((t) => ({
			name: t.title,
			value: t.url,
		}));

		await interaction.respond(
			tracks,
		);
	}
}
