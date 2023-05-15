const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playnext')
		.setDescription('Coloque uma música no topo da fila.')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('A música que você quer no topo da fila (URL ou nome).')
				.setRequired(true)
				.setAutocomplete(true),
		),
	async autocomplete(interaction) {
		const player = useMasterPlayer();
		const query = interaction.options.getString('query');
		const results = await player.search(query, {
			searchEngine: 'youtubeSearch',
		});

		const tracks = results.tracks.slice(0, 10).map((t) => ({
			name: t.title,
			value: t.url,
		}));

		await interaction.respond(
			tracks,
		);
	},
	async execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.followUp({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const query = interaction.options.getString('query');
		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult || !searchResult.tracks.length) {
			return interaction.followUp({ content: `Não encontrei a música (**${query}**).`, ephemeral: true });
		}
		queue.insertTrack(searchResult.tracks[0]);

		return interaction.followUp({ content: `Carregando a música **${searchResult.tracks[0].title}**`, ephemeral: true });
	},
};
