import { useMainPlayer } from 'discord-player';
import { Interaction } from 'discord.js';

export default async function interactionCreate(interaction: Interaction) {
	if (!interaction.isAutocomplete() || interaction.commandName !== 'play') {
		return;
	}

	const query = interaction.options.getString('query', true);

	if (!query.length) return interaction.respond([]);

	try {
		const player = useMainPlayer();

		const data = await player.search(query, {
			requestedBy: interaction.user,
			searchEngine: 'auto',
		});

		if (!data.hasTracks()) return interaction.respond([]);

		if (data.playlist) {
			return interaction.respond([
				{
					name: `${data.playlist.title} - ${data.playlist.source.charAt(0).toUpperCase() + data.playlist.source.slice(1)}`,
					value: data.playlist.url,
				},
			]);
		}

		const results = data.tracks.slice(0, 10).map((track) => {
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

		return interaction.respond(results);
	} catch {
		// eslint-disable-next-line no-empty-function
		return interaction.respond([]).catch(() => {});
	}
}
