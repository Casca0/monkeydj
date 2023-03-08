const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playnext')
		.setDescription('Coloque uma música no topo da fila.')
		.addStringOption((option) =>
			option.setName('query')
				.setDescription('A música que você quer no topo da fila (URL ou nome).')
				.setRequired(true)),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const query = interaction.options.getString('query');
		const searchResult = await player.search(query, {
			requestedBy: interaction.user,
		}).catch((err) => {
			console.log(err);
		});

		if (!searchResult || !searchResult.tracks.length) {
			return await interaction.reply({ content: `Não encontrei a música (**${query}**).`, ephemeral: true });
		}
		queue.insertTrack(searchResult.tracks[0]);

		return await interaction.reply({ content: `Carregando a música **${searchResult.tracks[0].title}**`, ephemeral: true });
	},
};
