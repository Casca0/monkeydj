const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

const { buttonRow } = require('../utils/dashboardComponents');

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

		const tracks = results.tracks.slice(0, 10).map((t) => {
			let title = t.title;

			if (title.length >= 255) {
				title = title.substring(0, 251).trimEnd() + '...';
			}

			const obj = {
				name: title,
				value: t.url,
			};

			return obj;
		});

		await interaction.respond(
			tracks,
		);
	},
	async execute(interaction) {
		const player = useMasterPlayer();

		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const query = interaction.options.getString('query');
		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult || !searchResult.tracks.length) {
			return interaction.reply({ content: `Não encontrei a música (**${query}**).`, ephemeral: true });
		}
		queue.insertTrack(searchResult.tracks[0]);

		if (queue.metadata.dashboard) {
			const message = await queue.metadata.dashboard.messages.fetch();
			const embed = message.find(msg => msg.content === '').embeds[0];

			const musicEmbed = EmbedBuilder.from(embed);

			queue.tracks.shuffle();

			musicEmbed.setFields({
				name: 'Próxima música',
				value: queue.tracks.data[0] ? `**[${queue.tracks.data[0].title}](${queue.tracks.data[0].url})** - ${queue.tracks.data[0].author}` : 'Não tem.',
			});

			message.find(msg => msg.content === '').edit({
				embeds: [musicEmbed],
				components: [buttonRow],
			});
		}

		return interaction.reply({ content: `Carregando a música **${searchResult.tracks[0].title}**`, ephemeral: true });
	},
};
