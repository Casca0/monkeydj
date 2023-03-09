const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Pula para uma música específica na fila.')
		.addIntegerOption((option) =>
			option.setName('músicas')
				.setDescription('Número de músicas para pular da fila.')
				.setRequired(true)),
	async execute(interaction, player) {
		const queue = player.nodes.get(interaction.guild.id);
		if (!queue || !queue.node.isPlaying()) {
			return await interaction.reply({ content: 'Nenhuma música está tocando!', ephemeral: true });
		}

		const indexOption = interaction.options.getInteger('músicas');

		const trackIndex = indexOption - 1;

		const trackName = queue.tracks.store[trackIndex].title;

		try {
			queue.node.skipTo(trackIndex);
		}
		catch (err) {
			console.log(err);
			return await interaction.reply({ content: 'Ocorreu um erro ao pular de música' });
		}
		return await interaction.reply({ content: `Pulando para **${trackName}**.` });
	},
};
