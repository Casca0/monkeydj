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
			searchEngine: 'youtubeSearch',
		});

		if (!data.hasTracks()) return interaction.respond([]);

		const results = data.tracks.slice(0, 10).map((track) => {
			let title = track.title;

			if (title.length >= 100) {
				title = title.substring(0, 96).trimEnd() + '...';
			}

			const trackObj = {
				name: title,
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
