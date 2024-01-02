import { Interaction } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { playlistModel } from '#bot/schemas/Playlist.Schema';

export default async function interactionCreate(interaction: Interaction) {
	if (!interaction.isAutocomplete() || interaction.commandName !== 'playlist') {
		return;
	}

	const focusedOption = interaction.options.getFocused(true);

	if (focusedOption.name === 'playlist') {
		const playlists = await playlistModel.find();

		const results = playlists.slice(0, playlists.length).map((p) => ({
			name: p.playlist_name,
			value: p.playlist_name,
		}));

		await interaction.respond(
			results,
		);
	}

	if (focusedOption.name === 'sua_playlist') {
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
		const query = interaction.options.getString('query', true) || ' ';
		const results = await player.search(query, {
			searchEngine: 'auto',
		});

		if (results.playlist) {
			return interaction.respond([
				{
					name: `${results.playlist.title} - ${results.playlist.source.charAt(0).toUpperCase() + results.playlist.source.slice(1)}`,
					value: results.playlist.url,
				},
			]);
		}

		const tracks = results.tracks.slice(0, results.tracks.length).map((track) => {
			let title = track.title;

			if (title.length >= 100) {
				title = title.substring(0, 88).trimEnd() + '...';
			}

			const trackObj = {
				name: `${title} - ${track.source.charAt(0).toUpperCase() + track.source.slice(1)}`,
				value: track.url,
			};

			return trackObj;
		});

		return interaction.respond(
			tracks,
		);
	}
}
