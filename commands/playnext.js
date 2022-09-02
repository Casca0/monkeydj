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
		const queue = player.getQueue(interaction.guild.id);
		if (!queue || !queue.playing) {
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
		queue.insert(searchResult.tracks[0]);

		await interaction.deferReply();

		return await interaction.followUp({ content: `Carregando a música **${searchResult.tracks[0].title}**`, ephemeral: true });
	},
};
